import axios from 'axios';
import express from 'express';
import { Octokit } from 'octokit';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/' , (req,res) => {
    res.send('Message is here......')
})

app.get('/github' , async(req,res) => {
    try {

       const Res =  await axios.get('https://api.github.com/users/sarb001');
       const UserData = Res?.data;
       console.log('DATa is -',UserData);

      const Username  = UserData?.name;
      const followers = UserData?.followers;
      const Following = UserData?.following;

      const RepoUrl = UserData?.repos_url;

      return res.json({
        Username,
        followers,
        Following,
        RepoUrl,
        success : true,
        message : "Fetched Specific URL"
      })

    } catch (error) {
        console.log('error -',error);
         return res.json({
            success : false,
            message : "Unable to fetch user"    
        })
    }
})

const reponame = 'Flowpay';

const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
}) 

app.get(`/github/${reponame}` , async(req,res) => {
    try {
  
    const MainRes = await octokit.request('GET /repos/sarb001/Flowpay/contents', {
        owner: 'OWNER',
        repo: 'REPO',
        path: 'PATH',
        headers: {
        'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    console.log('Main Response is here -',MainRes);

    const FileName = MainRes?.data?.map(i => i?.name)

    console.log('Main Res -',MainRes.data);
        return res.json({
            FileName,
            message : true,
            message : " DONeee "
        })

    } catch (error) {
        console.log('error -',error);
         return res.json({
            success : false,
            message : "Unable to Get Repo Details"    
        })
    }
})

app.post(`/github/${reponame}/issues` , async(req,res) => {
    try {
      
        const AllIssues = await octokit.request('POST /repos/sarb001/Flowpay/issues', {
            owner: 'sarb001',
            repo: 'Flowpay',
            title : "Trying First time",
            body : "Body is here  ,Body is here , Body is here", 
            labels: [
              'bug'
            ],
            headers: {
            'accept' : 'application/json',
            'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const MainIssueURL = AllIssues.data?.reactions.url;
        console.log('Issue Created-',MainIssueURL);

        return res.json({
            success : true,
            message : "Created an Issue"    
        })

    } catch (error) {
        console.log('error -',error);
        return res.json({
           success : false,
           message : "Unable to Get Repo Issues"    
       })
    }
})

app.listen(PORT, ()  => {
    console.log('Server is listening herrrre..');
})
