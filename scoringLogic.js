const axios = require('axios');
const keywordData = require('./risk_keywords.json');

const API_KEY = '49174427b558d2af53e538f950d775f5';
const BASE_URL = 'https://api.social-searcher.com/v2/search';


function decayWeight(n) {
  const base = [1.0, 0.5, 0.25];
  const additional = Math.max(n - 3, 0);
  return base
    .concat(Array(additional).fill(0.10))
    .slice(0, n)
    .reduce((a, b) => a + b, 0);
}

async function fetchMentions(keyword, email, company) {

  // const requests = [
  //   { network: 'linkedin' },
  //   { network: 'facebook' },
  //   { network: 'twitter' },
  //   {network:'web'}
  // ].map(config => {
  //   const params = {
  //     q: `${email} OR ${company}`, 
  //     key: API_KEY,
  //     network: config.network,
  //     lang: 'en'
  //   };
  //   return axios.get(BASE_URL, { params });
  // });

  try {
   
    // const responses = await Promise.all(requests);
    
    // const allPosts = responses.flatMap(response => 
    //   response.data.posts || []
    // );

   
    // const keywordLower = keyword.toLowerCase();
    // console.log("all posts")
    // console.log(allPosts)
    // return allPosts.filter(post => 
    //   post.text?.toLowerCase().includes(keywordLower)
    // );

    // const options = {
    //   method: 'GET',
    //   url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-posts',
    //   params: {
    //     username: 'syed-dawar-ali-bukhari-81668822a'
    //   },
    //   headers: {
    //     'x-rapidapi-key': 'aeb3201686msh526f7a596c6ec1bp14536cjsn183119f6a825',
    //     'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
    //   }
    // };

    // const response = await axios.request(options);
    
  // const params = {
  //   q: `${email} OR ${company}`,
  //   key: API_KEY,
  //   network: 'linkedin',
  // };

  
  // const res = await axios.get(BASE_URL, { params });
  // console.log(res.data)
  
  // return res.data.posts.filter(post =>
  //   post.text.toLowerCase().includes(keyword.toLowerCase())
  // );
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
        'Lack of rest':0
      };
  let employeeName=emp['Employee Name (Last Suffix, First MI)']

  let splitName=employeeName.split(',')
  let firstName=splitName[0].trim()
  let lastName=splitName[1].trim()
  
  let companyName=emp['Company Name']?emp['Company Name']:emp['Company ']
  
  
      const phraseMap = {};
      const optionsone = {
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/search-people',
        params: {
          firstName: firstName,
          lastName:lastName,
          company:companyName,
          postedAt:getLast90Days()
           
  
        },
        headers: {
          'x-rapidapi-key': '5ee531c420mshd0b4f07fd84fa89p1c7348jsnf7405ea0ca00',
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
      };
      
     
      const responseone = await axios.request(optionsone);
      console.log('username')
      console.log(responseone.data)
      console.log(responseone.data?.data?.items)
      
    //   let contains = responseone?.data?.data?.items?.filter(u => 
    //     u?.fullName?.toLowerCase().includes("riaz")
    //   );
  
    if(responseone.data?.data?.items==null){
    continue
    }
    let username=responseone.data?.data?.items[0]?.username;
     const optionstwo = {
      method: 'GET',
      url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-posts',
      params: {
        username: username,
      },
      headers: {
        'x-rapidapi-key': '5ee531c420mshd0b4f07fd84fa89p1c7348jsnf7405ea0ca00',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      }
    };
    
      const responsetwo = await axios.request(optionstwo);
    console.log("linkedin posts")
      console.log(responsetwo.data.data)
      if(!responsetwo?.data?.data){
continue
      }
  //   const twitteroptionsone =  {
  //     method: 'GET',
  //     url: 'https://twitter135.p.rapidapi.com/Search/',
  //     params: {
  //       q: 'Tina Abrams',
  //       count: '10',
  //       type: 'People',
  //       safe_search: 'false'
  //     },
  //     headers: {
  //       'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
  //       'x-rapidapi-host': 'twitter135.p.rapidapi.com'
  //     }
  //   };
  //   const responseone = await axios.request(twitteroptionsone);
  //   const firstMemberLegacy = responseone.data;
  //   let allUsers=firstMemberLegacy.data.search_by_raw_query.search_timeline.timeline.instructions[1].entries;
  
  //   allUsers?.map((val,i)=>{
  //     console.log(val?.content?.itemContent?.user_results?.result?.legacy)
  //   })
  //   // return;
    
  //   let matchedUser=allUsers.filter(val=>val?.content?.itemContent?.user_results?.result?.legacy?.name?.includes('tina'))
  // let username=matchedUser[1]?.content?.itemContent?.user_results?.result?.legacy?.screen_name;
  
  
  // const twitteroptionsthree = {
  //   method: 'GET',
  //   url: 'https://twitter135.p.rapidapi.com/v2/UserByScreenName/',
  //   params: {
  //     username:'correa_rebeca'
  //   },
  //   headers: {
  //     'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
  //     'x-rapidapi-host': 'twitter135.p.rapidapi.com'
  //   }
  // };
  
  // const twitterResponseThree = await axios.request(twitteroptionsthree);
  
  // console.log(twitterResponseThree.data.data.user.result.rest_id)
  // return;
  // let userId=twitterResponseThree.data.data.user.result.rest_id
  // const options = {
  //   method: 'POST',
  //   url: 'https://social-media-email-scraper-2025.p.rapidapi.com/v2/get_email',
  //   headers: {
  //     'x-rapidapi-key': '06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
  //     'x-rapidapi-host': 'social-media-email-scraper-2025.p.rapidapi.com',
  //     'Content-Type': 'application/json'
  //   },
  //   data: {
  //     platform: 'twitter',
  //     username: username,
  //   }
  // };
  
  
  // const response = await axios.request(options);
  // console.log(response.data)
  
  
  
  
  // const twitteroptionstwo={
  //   method: 'GET',
  //   url: 'https://twitter241.p.rapidapi.com/user-tweets',
  //   params: {
  //     user: userId,
  //     count: '20'
  //   },
  //   headers: {
  //    'X-Rapidapi-Key' :'06f131c757mshe6d549d8f59da3ep198b32jsn22106f38098f',
  //     'x-rapidapi-host': 'twitter241.p.rapidapi.com'
  //   }
  // };
  // const twitterResponse = await axios.request(twitteroptionstwo);
  
  // console.log(twitterResponse.data.result?.timeline?.instructions[1]?.entries[0])
   
  
      for (const keyword of keywordData) {
        const matches = responsetwo.data.data.filter(u => 
          u.text?.toLowerCase().includes(keyword.Phrase?.toLowerCase()) 
        );
        console.log(matches)
        if (matches?.length > 0) {
          const count = matches?.length;
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
      console.error(`Error processing ${emp['Employee Name']}:`, error);
      // Push empty result to maintain array length
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