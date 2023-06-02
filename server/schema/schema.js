

// Mongoose models

const Project = require('../models/Project');
const Client = require('../models/Client');

const {GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLSchema, GraphQLEnumType} = require('graphql');


// Client type

const ClientType =new GraphQLObjectType({
    name:'Client',
    fields:()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        email:{type: GraphQLString},
        phone:{type: GraphQLString},

    })
})


//project type 

const ProjectType =new GraphQLObjectType({
    name:'Project',
    fields:()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        description:{type: GraphQLString},
        status:{type: GraphQLString},
        client:{
            type: ClientType,
            resolve:(parent,args)=>(Client.findById(parent.clientId))
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        projects:{
            type: new GraphQLList(ProjectType),
            resolve:()=>{
                return Project.find();
            }
        },
        project:{
            type: ProjectType,
            args:{id:{type: GraphQLID}},
            resolve:(parent,args) =>{
                const project = Project.findById(args.id)
                return project;
            }
        },
        clients:{
            type: new GraphQLList(ClientType),
            resolve:()=>{
                return Client.find();
            }
        },
        client:{
            type: ClientType,
            args:{id:{type: GraphQLID}},
            resolve:(parent,args) =>{
                const client = Client.findById(args.id)
                return client;
            }
        }
    }
})


//mutatations

const mutatations = new GraphQLObjectType({
    name:'Mutatations',
    fields:()=>({
        //add client
        addClient:{
            type:ClientType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                phone:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve:(parent,args)=>{
                const client = new Client({
                    name:args.name,
                    email:args.email,
                    phone:args.phone
                })
                return client.save();
            }
        },
        //delete client
        deleteClient:{
            type:ClientType,
            args:{id:{type:GraphQLNonNull(GraphQLID)}},
            resolve:(parent,args)=>{
                 return Client.findByIdAndRemove(args.id)
            }
        },
        //Add a project
        addProject:{
            type:ProjectType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                description:{type:GraphQLNonNull(GraphQLString)},
                status:{
                    type:new GraphQLEnumType({
                        name:'ProjectStatus',
                        values:{
                            'new':{value: 'Not Started'},
                            'progress':{value: 'In Progress'},
                            'completed':{value: 'Completed'},

                        }
                    }),
                    defaultValue:'Not Started'
            },
            clientId:{type:GraphQLNonNull(GraphQLID)},
        },
        resolve:(parent,args)=>{
             const project = new Project({
                name:args.name,
                description:args.description,
                status:args.status,
                clientId:args.clientId
             })
             return project.save();
        },
    },
    //delete a project

    deleteProject:{
        type:ProjectType,
        args:{
            id:{type: GraphQLNonNull(GraphQLID)},
        },
        resolve:(parent,args)=>{
            return Project.findByIdAndRemove(args.id); 
       },
    },
})
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:mutatations
})