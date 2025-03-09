import axios from "axios";
import { Router } from "express"
import { Octokit } from "octokit";
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
console.log(' main toke is -',GITHUB_TOKEN);

const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
});

const reponame = 'Flowpay';

router.get('/rate_limit' , async(req,res) => {
  
  const Res  = await octokit.request('GET /rate_limit', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  console.log('Response -',Res);
  return res.json({
    message : "done"
  })
})


router.get('/github' ,  async(req,res) => {
    try {
            const Res =  await axios.get('https://api.github.com/users/sarb001', {
                headers : {
                    'Authorization' : `token ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            });
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

router.get(`/github/Flowpay` , async(req,res) => {

    try {
    const MainRes = await octokit.request('GET /repos/sarb001/Flowpay/contents', {
        owner: 'sarb001',
        repo: 'Flowpay',
        path: 'PATH',
        headers: {
             'X-GitHub-Api-Version': '2022-11-28',
             'authorization' : `token ${process.env.GITHUB_ACCESS_TOKEN}`
        }
    });

    const FileName = MainRes?.data?.map(i => i?.name)

        return res.json({
            FileName,
            message : true,
            message : "All Files Fetched"
        })

    } catch (error) {
        console.log('error -',error);
         return res.json({
            success : false,
            message : "Unable to Get Repo Details"    
        })
    }

})

router.post(`/github/${reponame}/issues` , async(req,res) => {
    try {
        const Response = await req.body;

        if(!Response.title || !Response?.body){
            return res.json({
                success : false,
                message : " Enter All Data "
            })
        }

        const AllIssues = await octokit.request('POST /repos/sarb001/Flowpay/issues', {
            owner: 'sarb001',
            repo: 'Flowpay',
            title : Response?.title,
            body : Response?.body, 
            labels: [
              'bug'
            ],
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'authorization' : `token ${process.env.GITHUB_ACCESS_TOKEN}`
           }
        });
        const MainIssueURL = AllIssues.data?.reactions.url;

        return res.json({
            MainIssueURL,
            success : true,
            message : " Issue Created "    
        })

    } catch (error) {
        console.log('error issue -',error);
        return res.json({
           success : false,
           message : "Issue Creation Failed"    
       })
    }
})


export default router;