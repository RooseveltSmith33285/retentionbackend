const axios = require('axios');
const keywordData = require('./risk_keywords.json');

const API_KEY = '49174427b558d2af53e538f950d775f5';
const BASE_URL = 'https://api.social-searcher.com/v2/search';

const peopledatalabs =require('@api/peopledatalabs');

peopledatalabs.auth('30d80327aac2828dd4df86eaf9ec379dd5bae8d495490b2c41f4f313ca34adea');
function decayWeight(n) {
  const base = [1.0, 0.5, 0.25];
  const additional = Math.max(n - 3, 0);
  return base
    .concat(Array(additional).fill(0.10))
    .slice(0, n)
    .reduce((a, b) => a + b, 0);
}

async function fetchMentions(keyword, socialMedia,done) {
    try {
      const allPosts = [];
      console.log("socialmedia")
      console.log(socialMedia)
      console.log(done)
      delete socialMedia.linkedin_username
      if (socialMedia.linkedin_url && done.linkedin==false) {
        const username = socialMedia.linkedin_url.split('/').pop();
        const linkedinOptions = {
          method: 'GET',
          url: 'https://linkedin-api8.p.rapidapi.com/get-profile-posts?username=roosevelt-smith-285b4a9b',
        
          headers: {
            'x-rapidapi-key': '423577dcd1msh3e31e9d469ec9a7p154656jsneec34d2c7ecd',
            'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
          }
        };
  
        const linkedinResponse = await axios.request(linkedinOptions);
       console.log(linkedinResponse.data)
        const linkedinPosts = linkedinResponse.data.data
          .filter(post => post?.text || post?.resharedPost?.text)
          .map(post => ({
            text: post.text || post.resharedPost.text,
            network: 'linkedin'
          }));
          console.log(linkedinPosts)
        allPosts.push(...linkedinPosts);
        done.linkedin=true
  
        }
      if (socialMedia.twitter_username && done.twitter==false) {
        const twitterOptions = {
          method: 'GET',
          url: 'https://twitter241.p.rapidapi.com/user',
          params: { username: socialMedia.twitter_username },
          headers: {
            'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
          }
        };
  
        const twitterResponse = await axios.request(twitterOptions);
        const userId = twitterResponse.data.result.data.user.result.rest_id;
  
        const twitterPostOptions = {
          method: 'GET',
          url: 'https://twitter241.p.rapidapi.com/user-tweets',
          params: { user: userId, count: '20' },
          headers: {
            'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
          }
        };
  
        const twitterPostResponse = await axios.request(twitterPostOptions);
        const twitterPosts = twitterPostResponse.data.result.timeline.instructions
          .find(i => i.type === "TimelineAddEntries")?.entries
          ?.filter(entry => entry.entryId?.startsWith("tweet-"))
          .map(entry => ({
            text: entry.content.itemContent.tweet_results.result.legacy.full_text,
            network: 'twitter'
          })) || [];
          
        allPosts.push(...twitterPosts);
        done.twitter=true
      }
  
  
      if (socialMedia.facebook_username && done.facebook) {
        const facebookOptions = {
          method: 'GET',
          url: 'https://facebook-scraper3.p.rapidapi.com/profile/details_url',
          params: { url: socialMedia.facebook_url || `https://facebook.com/${socialMedia.facebook_username}` },
          headers: {
            'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
          }
        };
  
        const facebookResponse = await axios.request(facebookOptions);
        const profileId = facebookResponse.data.profile.profile_id;
  
        const facebookPostOptions = {
          method: 'GET',
          url: 'https://facebook-scraper3.p.rapidapi.com/profile/posts',
          params: { profile_id: profileId },
          headers: {
            'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
          }
        };
  
        const facebookPostResponse = await axios.request(facebookPostOptions);
        console.log("FACEBOOK POSTs")
        console.log(facebookPostResponse.data.results)
        const facebookPosts = facebookPostResponse.data.results
        .filter(post => post.message)  
        .map(post => ({
          text: post.message,
          network: 'facebook'
        }));
      
      console.log(facebookPosts);
      
        allPosts.push(...facebookPosts);
        done.facebook=true
      }

   
      return allPosts.filter(post =>
        post.text.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch (error) {
      console.error('API Error:', error.message);
      return [];
    }
  }
  

async function processEmployees(employees) {
  const results = [];
  

  for (const emp of employees) {
   

   
    try{
      const categories = {
        'schedule & workload': 0,
        'money & compensation': 0,
        'job satisfaction': 0,
        'family & work-life balance': 0,
        'communication & leadership': 0,
        'Lack of rest':0,       
      };
  let employeeName=emp['Employee Name (Last Suffix, First MI)']?emp['Employee Name (Last Suffix, First MI)']:emp['Employee Name (Last Suffix,First MI)']

  let splitName=employeeName?.includes(',')?employeeName.split(','):employeeName.split(' ')
 
  let firstName=splitName[0].trim()
  let lastName=splitName[1].trim()
  let email=emp['E-mail Address']?emp['E-mail Address']:emp['Alternate Email']
  let phone=emp['Home Phone (Formatted)']
const refinedPhone = "+" + phone.replace(/\D/g, "");
  let companyName=emp['Company Name']?emp['Company Name']:emp['Company ']
  
  
      const phraseMap = {};
   
     
      
      const options = {
        method: 'GET',
        url: `https://api.peopledatalabs.com/v5/person/identify?name=${employeeName}&first_name=${firstName}&last_name=${lastName}&email=${email}&company=${companyName}&pretty=false&titlecase=false&include_if_matched=false`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': '96daa17b289fb6f8c7bce95a15303c8d29b3e8cf4415e8247a8753008de5331b'
        }
      };
      
      const data = await axios.request(options);

     
   let twitterUsername =null;
   let linkedinUsername = null;
   let facebookUsername = null;
if(data?.data?.matches[0]?.data?.linkedin_username){
linkedinUsername=data?.data?.matches[0]?.data?.linkedin_username
}
if(data?.data?.matches[0]?.data?.twitter_username){
twitterUsername= data?.data?.matches[0]?.data?.twitter_username
}

if(data?.data?.matches[0]?.data?.facebook_username){
facebookUsername=data?.data?.matches[0]?.data?.facebook_username
}



      if(!data?.data?.matches[0]?.data?.profiles){
continue;
      }
     
      const socialMedia = {
        linkedin_url: data?.data?.matches[0]?.data?.linkedin_url|| null,
        linkedin_username: linkedinUsername || null,
        twitter_url:data?.data?.matches[0]?.data?.twitter_url|| null,
        twitter_username: twitterUsername || null,
        facebook_url: data?.data?.matches[0]?.data?.facebook_url || null,
        facebook_username: facebookUsername || null
      };
    
     let done={
      facebook:false,
      twitter:false,
      linkedin:false
     }
  
      for (const keyword of keywordData) {
        // const matches = responsetwo.data.data.filter(u => 
        //   u.text?.toLowerCase().includes(keyword.Phrase?.toLowerCase()) 
        // );
       
        const matches = await fetchMentions(keyword.Phrase, socialMedia,done);
        
        
        if (matches?.length > 0) {
            const count = matches.length;
            const weighted = keyword.RiskScore * decayWeight(count);
            phraseMap[keyword.Category] = (phraseMap[keyword.Category] || 0) + weighted;
          }
        }
  
      let totalScore = 0;
      for (const [cat, rawScore] of Object.entries(phraseMap)) {
        const capped = Math.min(5, rawScore);
        categories[cat.toLowerCase()] = capped;
        totalScore += capped;
      }
  
      let riskLevel = 'Low';
      if (totalScore > 17) riskLevel = 'Critical';
      else if (totalScore > 10) riskLevel = 'High';
      else if (totalScore > 5) riskLevel = 'Moderate';
  
      results.push({
        name: emp['Employee Name (Last Suffix, First MI)'],
        email: emp['E-mail Address'],
        ...categories,
        totalScore,
        riskLevel,
      });
    }catch(e){
        console.log(e.message)
      results.push(createDefaultResult(emp));
    }
  }

  return results;
}


function createDefaultResult(emp) {
  return {
    name: emp['Employee Name (Last Suffix, First MI)'],
    email: emp['E-mail Address'],
    'schedule & workload': 0,
    'money & compensation': 0,
    'job satisfaction': 0,
    'family & work-life balance': 0,
    'communication & leadership': 0,
    'Lack of rest': 0,
    totalScore: 0,
    riskLevel: 'Low'
  };
}


function getLast90Days() {
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90); 
  return ninetyDaysAgo.toISOString().slice(0, 19).replace('T', ' '); 
}

module.exports = { processEmployees };




// const axios = require('axios');
// const keywordData = require('./risk_keywords.json');

// const API_KEY = '49174427b558d2af53e538f950d775f5';
// const BASE_URL = 'https://api.social-searcher.com/v2/search';


// function decayWeight(n) {
//   const base = [1.0, 0.5, 0.25];
//   const additional = Math.max(n - 3, 0);
//   return base
//     .concat(Array(additional).fill(0.10))
//     .slice(0, n)
//     .reduce((a, b) => a + b, 0);
// }

// async function fetchMentions(keyword, email, company) {

//   // const requests = [
//   //   { network: 'linkedin' },
//   //   { network: 'facebook' },
//   //   { network: 'twitter' },
//   //   {network:'web'}
//   // ].map(config => {
//   //   const params = {
//   //     q: `${email} OR ${company}`, 
//   //     key: API_KEY,
//   //     network: config.network,
//   //     lang: 'en'
//   //   };
//   //   return axios.get(BASE_URL, { params });
//   // });

//   try {
   
//     // const responses = await Promise.all(requests);
    
//     // const allPosts = responses.flatMap(response => 
//     //   response.data.posts || []
//     // );

   
//     // const keywordLower = keyword.toLowerCase();
//     // console.log("all posts")
//     // console.log(allPosts)
//     // return allPosts.filter(post => 
//     //   post.text?.toLowerCase().includes(keywordLower)
//     // );

//     // const options = {
//     //   method: 'GET',
//     //   url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-posts',
//     //   params: {
//     //     username: 'syed-dawar-ali-bukhari-81668822a'
//     //   },
//     //   headers: {
//     //     'x-rapidapi-key': 'aeb3201686msh526f7a596c6ec1bp14536cjsn183119f6a825',
//     //     'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
//     //   }
//     // };

//     // const response = await axios.request(options);
    
//   // const params = {
//   //   q: `${email} OR ${company}`,
//   //   key: API_KEY,
//   //   network: 'linkedin',
//   // };

  
//   // const res = await axios.get(BASE_URL, { params });
//   // console.log(res.data)
  
//   // return res.data.posts.filter(post =>
//   //   post.text.toLowerCase().includes(keyword.toLowerCase())
//   // );
//   } catch (error) {
//     console.error('API Error:', error.message);
//     return [];
//   }
// }

// async function processEmployees(employees) {
//  try{
//     const results = [];

//     for (const emp of employees) {
//       try{
//         const categories = {
//           'schedule & workload': 0,
//           'money & compensation': 0,
//           'job satisfaction': 0,
//           'family & work-life balance': 0,
//           'communication & leadership': 0,
//           'Lack of rest':0
//         };
//     let employeeName=emp['Employee Name (Last Suffix, First MI)']
  
//     let splitName=employeeName.split(',')
   
//     let firstName=splitName[0].trim()
  
//     let lastName=splitName[1].trim()
    
//     let companyName=emp['Company Name']?emp['Company Name']:emp['Company ']
    
    
//         const phraseMap = {};
//         const optionsone = {
//           method: 'GET',
//           url: 'https://linkedin-data-api.p.rapidapi.com/search-people',
//           params: {
//             firstName: 'Roosevelt',
//             lastName:'Smith ',
//             company:'Enrichify',
//             postedAt:getLast90Days()
             
    
//           },
//           headers: {
//             'x-rapidapi-key': '541b5657f9msh2d0cb1e2f2963a2p1211a5jsnd1aff8946588',
//             'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
//           }
//         };
        
       
//         const responseone = await axios.request(optionsone);
//         console.log('username')
//         console.log(responseone.data)
//         console.log(responseone.data?.data?.items)
        
//       //   let contains = responseone?.data?.data?.items?.filter(u => 
//       //     u?.fullName?.toLowerCase().includes("riaz")
//       //   );
    
//       if(responseone.data?.data?.items==null){
//       continue
//       }
//       let username=responseone.data?.data?.items[0]?.username;
//        const optionstwo = {
//         method: 'GET',
//         url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-posts',
//         params: {
//           username: username,
//         },
//         headers: {
//           'x-rapidapi-key': '541b5657f9msh2d0cb1e2f2963a2p1211a5jsnd1aff8946588',
//           'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
//         }
//       };
      
//         const responsetwo = await axios.request(optionstwo);
//       console.log("linkedin posts")
//         console.log(responsetwo.data.data)
//         if(!responsetwo?.data?.data){
//   continue
//         }
//     //   const twitteroptionsone =  {
//     //     method: 'GET',
//     //     url: 'https://twitter135.p.rapidapi.com/Search/',
//     //     params: {
//     //       q: 'Tina Abrams',
//     //       count: '10',
//     //       type: 'People',
//     //       safe_search: 'false'
//     //     },
//     //     headers: {
//     //       'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
//     //       'x-rapidapi-host': 'twitter135.p.rapidapi.com'
//     //     }
//     //   };
//     //   const responseone = await axios.request(twitteroptionsone);
//     //   const firstMemberLegacy = responseone.data;
//     //   let allUsers=firstMemberLegacy.data.search_by_raw_query.search_timeline.timeline.instructions[1].entries;
    
//     //   allUsers?.map((val,i)=>{
//     //     console.log(val?.content?.itemContent?.user_results?.result?.legacy)
//     //   })
//     //   // return;
      
//     //   let matchedUser=allUsers.filter(val=>val?.content?.itemContent?.user_results?.result?.legacy?.name?.includes('tina'))
//     // let username=matchedUser[1]?.content?.itemContent?.user_results?.result?.legacy?.screen_name;
    
    
//     // const twitteroptionsthree = {
//     //   method: 'GET',
//     //   url: 'https://twitter135.p.rapidapi.com/v2/UserByScreenName/',
//     //   params: {
//     //     username:'correa_rebeca'
//     //   },
//     //   headers: {
//     //     'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
//     //     'x-rapidapi-host': 'twitter135.p.rapidapi.com'
//     //   }
//     // };
    
//     // const twitterResponseThree = await axios.request(twitteroptionsthree);
    
//     // console.log(twitterResponseThree.data.data.user.result.rest_id)
//     // return;
//     // let userId=twitterResponseThree.data.data.user.result.rest_id
//     // const options = {
//     //   method: 'POST',
//     //   url: 'https://social-media-email-scraper-2025.p.rapidapi.com/v2/get_email',
//     //   headers: {
//     //     'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
//     //     'x-rapidapi-host': 'social-media-email-scraper-2025.p.rapidapi.com',
//     //     'Content-Type': 'application/json'
//     //   },
//     //   data: {
//     //     platform: 'twitter',
//     //     username: username,
//     //   }
//     // };
    
    
//     // const response = await axios.request(options);
//     // console.log(response.data)
    
    
    
    
//     // const twitteroptionstwo={
//     //   method: 'GET',
//     //   url: 'https://twitter241.p.rapidapi.com/user-tweets',
//     //   params: {
//     //     user: userId,
//     //     count: '20'
//     //   },
//     //   headers: {
//     //    'X-Rapidapi-Key' :'06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
//     //     'x-rapidapi-host': 'twitter241.p.rapidapi.com'
//     //   }
//     // };
//     // const twitterResponse = await axios.request(twitteroptionstwo);
    
//     // console.log(twitterResponse.data.result?.timeline?.instructions[1]?.entries[0])
     
    
//         for (const keyword of keywordData) {
//           const matches = responsetwo.data.data.filter(u => 
//             u.text?.toLowerCase().includes(keyword.Phrase?.toLowerCase()) 
//           );
//           console.log(matches)
//           if (matches?.length > 0) {
//             const count = matches?.length;
//             const weighted = keyword.RiskScore * decayWeight(count);
//             phraseMap[keyword.Category] = (phraseMap[keyword.Category] || 0) + weighted;
//           }
//         }
    
//         let totalScore = 0;
//         for (const [cat, rawScore] of Object.entries(phraseMap)) {
//           const capped = Math.min(5, rawScore);
//           categories[cat.toLowerCase()] = capped;
//           totalScore += capped;
//         }
    
//         let riskLevel = 'Low';
//         if (totalScore > 17) riskLevel = 'Critical';
//         else if (totalScore > 10) riskLevel = 'High';
//         else if (totalScore > 5) riskLevel = 'Moderate';
    
//         results.push({
//           name: emp['Employee Name (Last Suffix, First MI)'],
//           email: emp['E-mail Address'],
//           ...categories,
//           totalScore,
//           riskLevel,
//         });
//       }catch(error){
//         console.error(`Error processing ${emp['Employee Name']}:`, error);
//         // Push empty result to maintain array length
//         results.push(createDefaultResult(emp));
//       }
//     }
  
//     return results;
  
//  } catch(e){
//     console.log(e.message)
//  }
// }


// function createDefaultResult(emp) {
//   return {
//     name: emp['Employee Name (Last Suffix, First MI)'],
//     email: emp['E-mail Address'],
//     'schedule & workload': 0,
//     'money & compensation': 0,
//     'job satisfaction': 0,
//     'family & work-life balance': 0,
//     'communication & leadership': 0,
//     'Lack of rest': 0,
//     totalScore: 0,
//     riskLevel: 'Low'
//   };
// }


function getLast90Days() {
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90); 
  return ninetyDaysAgo.toISOString().slice(0, 19).replace('T', ' '); 
}

// module.exports = { processEmployees };