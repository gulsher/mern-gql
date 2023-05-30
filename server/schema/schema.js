const { projects , clients} = require('./sampleData');


const {GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLSchema} = require('graphql');


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

    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        projects:{
            type: new GraphQLList(ProjectType),
            resolve:()=>{
                return projects;
            }
        },
        project:{
            type: ProjectType,
            args:{id:{type: GraphQLID}},
            resolve:(parent,args) =>{
                const project = projects.find(project=>project.id === args.id);
                return project;
            }
        },
        clients:{
            type: new GraphQLList(ClientType),
            resolve:()=>{
                return clients;
            }
        },
        client:{
            type: ClientType,
            args:{id:{type: GraphQLID}},
            resolve:(parent,args) =>{
                const client = clients.find(client=>client.id === args.id);
                return client;
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})