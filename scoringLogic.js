


// const axios = require('axios');
// const keywordData = require('./risk_keywords.json');

// const API_KEY = '49174427b558d2af53e538f950d775f5';
// const BASE_URL = 'https://api.social-searcher.com/v2/search';

// const peopledatalabs = require('@api/peopledatalabs');

// peopledatalabs.auth('30d80327aac2828dd4df86eaf9ec379dd5bae8d495490b2c41f4f313ca34adea');

// function decayWeight(n) {
//   const base = [1.0, 0.5, 0.25];
//   const additional = Math.max(n - 3, 0);
//   return base
//     .concat(Array(additional).fill(0.10))
//     .slice(0, n)
//     .reduce((a, b) => a + b, 0);
// }

// // Optimized function to fetch all posts once per employee
// async function fetchAllSocialMediaPosts(socialMedia) {
//   try {
//     const allPosts = [];
    
//     // LinkedIn posts
//     if (socialMedia.linkedin_url) {
//       try {
//         const username = socialMedia.linkedin_url.split('/').pop();
//         const linkedinOptions = {
//           method: 'GET',
//           url: `https://linkedin-api8.p.rapidapi.com/get-profile-posts?username=${username}`,
//           headers: {
//             'x-rapidapi-key': '423577dcd1msh3e31e9d469ec9a7p154656jsneec34d2c7ecd',
//             'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
//           }
//         };

//         const linkedinResponse = await axios.request(linkedinOptions);
//         console.log('LinkedIn response:', linkedinResponse.data);
        
//         const linkedinPosts = linkedinResponse.data.data
//           ?.filter(post => post?.text || post?.resharedPost?.text)
//           .map(post => ({
//             text: post.text || post.resharedPost.text,
//             network: 'linkedin'
//           })) || [];
        
//         allPosts.push(...linkedinPosts);
//       } catch (error) {
//         console.error('LinkedIn API Error:', error.message);
//       }
//     }

//     // Twitter posts
//     if (socialMedia.twitter_username) {
//       try {
//         const twitterOptions = {
//           method: 'GET',
//           url: 'https://twitter241.p.rapidapi.com/user',
//           params: { username: socialMedia.twitter_username },
//           headers: {
//             'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
//             'x-rapidapi-host': 'twitter241.p.rapidapi.com'
//           }
//         };

//         const twitterResponse = await axios.request(twitterOptions);
//         const userId = twitterResponse.data.result.data.user.result.rest_id;

//         const twitterPostOptions = {
//           method: 'GET',
//           url: 'https://twitter241.p.rapidapi.com/user-tweets',
//           params: { user: userId, count: '20' },
//           headers: {
//             'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
//             'x-rapidapi-host': 'twitter241.p.rapidapi.com'
//           }
//         };

//         const twitterPostResponse = await axios.request(twitterPostOptions);
//         const twitterPosts = twitterPostResponse.data.result.timeline.instructions
//           .find(i => i.type === "TimelineAddEntries")?.entries
//           ?.filter(entry => entry.entryId?.startsWith("tweet-"))
//           .map(entry => ({
//             text: entry.content.itemContent.tweet_results.result.legacy.full_text,
//             network: 'twitter'
//           })) || [];
          
//         allPosts.push(...twitterPosts);
//       } catch (error) {
//         console.error('Twitter API Error:', error.message);
//       }
//     }

//     // Facebook posts
//     if (socialMedia.facebook_username) {
//       try {
//         const facebookOptions = {
//           method: 'GET',
//           url: 'https://facebook-scraper3.p.rapidapi.com/profile/details_url',
//           params: { url: socialMedia.facebook_url || `https://facebook.com/${socialMedia.facebook_username}` },
//           headers: {
//             'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
//             'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
//           }
//         };

//         const facebookResponse = await axios.request(facebookOptions);
//         const profileId = facebookResponse.data.profile.profile_id;

//         const facebookPostOptions = {
//           method: 'GET',
//           url: 'https://facebook-scraper3.p.rapidapi.com/profile/posts',
//           params: { profile_id: profileId },
//           headers: {
//             'x-rapidapi-key': '074cf77d1amsh7dcb0779569cf53p13dfc9jsn48c665c8ed27',
//             'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
//           }
//         };

//         const facebookPostResponse = await axios.request(facebookPostOptions);
//         console.log("FACEBOOK POSTS:", facebookPostResponse.data.results);
        
//         const facebookPosts = facebookPostResponse.data.results
//           ?.filter(post => post.message)  
//           .map(post => ({
//             text: post.message,
//             network: 'facebook'
//           })) || [];
        
//         allPosts.push(...facebookPosts);
//       } catch (error) {
//         console.error('Facebook API Error:', error.message);
//       }
//     }

//     return allPosts;
//   } catch (error) {
//     console.error('Overall API Error:', error.message);
//     return [];
//   }
// }

// // Optimized function to match all keywords against fetched posts
// function matchKeywordsInPosts(posts, keywords) {
//   const results = {};
  
//   keywords.forEach(keyword => {
//     const matches = posts.filter(post =>
//       post.text.toLowerCase().includes(keyword.Phrase.toLowerCase())
//     );
    
//     if (matches.length > 0) {
//       const count = matches.length;
//       const weighted = keyword.RiskScore * decayWeight(count);
//       const category = keyword.Category.toLowerCase();
//       results[category] = (results[category] || 0) + weighted;
//     }
//   });
  
//   return results;
// }

// async function processEmployees(employees) {
//   const results = [];

//   for (const emp of employees) {
//     try {
//       const categories = {
//         'schedule & workload': 0,
//         'money & compensation': 0,
//         'job satisfaction': 0,
//         'family & work-life balance': 0,
//         'communication & leadership': 0,
//         'lack of rest': 0,       
//       };

//       let employeeName = emp['Employee Name (Last Suffix, First MI)'] ? 
//         emp['Employee Name (Last Suffix, First MI)'] : 
//         emp['Employee Name (Last Suffix,First MI)'];

//       let splitName = employeeName?.includes(',') ? 
//         employeeName.split(',') : 
//         employeeName.split(' ');
 
//       let firstName = splitName[0].trim();
//       let lastName = splitName[1].trim();
//       let email = emp['E-mail Address'] ? emp['E-mail Address'] : emp['Alternate Email'];
//       let phone = emp['Home Phone (Formatted)'];
//       const refinedPhone = "+" + phone.replace(/\D/g, "");
//       let companyName = emp['Company Name'] ? emp['Company Name'] : emp['Company '];

//       // Get social media profiles
//       const options = {
//         method: 'GET',
//         url: `https://api.peopledatalabs.com/v5/person/identify?name=${employeeName}&first_name=${firstName}&last_name=${lastName}&email=${email}&company=${companyName}&pretty=false&titlecase=false&include_if_matched=false`,
//         headers: {
//           accept: 'application/json',
//           'Content-Type': 'application/json',
//           'X-API-Key': '96daa17b289fb6f8c7bce95a15303c8d29b3e8cf4415e8247a8753008de5331b'
//         }
//       };
      
//       const data = await axios.request(options);

//       let twitterUsername = null;
//       let linkedinUsername = null;
//       let facebookUsername = null;
      
//       if (data?.data?.matches[0]?.data?.linkedin_username) {
//         linkedinUsername = data?.data?.matches[0]?.data?.linkedin_username;
//       }
//       if (data?.data?.matches[0]?.data?.twitter_username) {
//         twitterUsername = data?.data?.matches[0]?.data?.twitter_username;
//       }
//       if (data?.data?.matches[0]?.data?.facebook_username) {
//         facebookUsername = data?.data?.matches[0]?.data?.facebook_username;
//       }

//       if (!data?.data?.matches[0]?.data?.profiles) {
//         continue;
//       }

//       const socialMedia = {
//         linkedin_url: data?.data?.matches[0]?.data?.linkedin_url || null,
//         linkedin_username: linkedinUsername || null,
//         twitter_url: data?.data?.matches[0]?.data?.twitter_url || null,
//         twitter_username: twitterUsername || null,
//         facebook_url: data?.data?.matches[0]?.data?.facebook_url || null,
//         facebook_username: facebookUsername || null
//       };

//       // Fetch all posts once for this employee
//       console.log(`Fetching social media posts for ${employeeName}...`);
//       const allPosts = await fetchAllSocialMediaPosts(socialMedia);
//       console.log(`Found ${allPosts.length} total posts for ${employeeName}`);

//       // Match all keywords against the fetched posts
//       const phraseMap = matchKeywordsInPosts(allPosts, keywordData);

//       // Calculate scores
//       let totalScore = 0;
//       for (const [cat, rawScore] of Object.entries(phraseMap)) {
//         const capped = Math.min(5, rawScore);
//         categories[cat] = capped;
//         totalScore += capped;
//       }

//       let riskLevel = 'Low';
//       if (totalScore > 17) riskLevel = 'Critical';
//       else if (totalScore > 10) riskLevel = 'High';
//       else if (totalScore > 5) riskLevel = 'Moderate';

//       results.push({
//         name: emp['Employee Name (Last Suffix, First MI)'],
//         email: emp['E-mail Address'],
//         ...categories,
//         totalScore,
//         riskLevel,
//       });

//     } catch (e) {
//       console.log(`Error processing employee: ${e.message}`);
//       results.push(createDefaultResult(emp));
//     }
//   }

//   return results;
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
//     'lack of rest': 0,
//     totalScore: 0,
//     riskLevel: 'Low'
//   };
// }

// function getLast90Days() {
//   const today = new Date();
//   const ninetyDaysAgo = new Date(today);
//   ninetyDaysAgo.setDate(today.getDate() - 90); 
//   return ninetyDaysAgo.toISOString().slice(0, 19).replace('T', ' '); 
// }

// module.exports = { processEmployees };










const axios = require('axios');
const keywordData = require('./risk_keywords.json');

const API_KEY = '49174427b558d2af53e538f950d775f5';
const BASE_URL = 'https://api.social-searcher.com/v2/search';

const peopledatalabs = require('@api/peopledatalabs');

peopledatalabs.auth('30d80327aac2828dd4df86eaf9ec379dd5bae8d495490b2c41f4f313ca34adea');

function decayWeight(n) {
  const base = [1.0, 0.5, 0.25];
  const additional = Math.max(n - 3, 0);
  return base
    .concat(Array(additional).fill(0.10))
    .slice(0, n)
    .reduce((a, b) => a + b, 0);
}

// Optimized function to fetch all posts once per employee
async function fetchAllSocialMediaPosts(socialMedia) {
  try {
    
    const allPosts = [];
    
    // LinkedIn posts
    if (socialMedia.linkedin_url) {
      try {
       
        const linkedinOptions = {
          method: 'GET',
          url: `https://linkedin-api8.p.rapidapi.com/get-profile-posts?username=${socialMedia.linkedin_username}`,
          headers: {
            'x-rapidapi-key': '423577dcd1msh3e31e9d469ec9a7p154656jsneec34d2c7ecd',
            'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
          }
        };

        const linkedinResponse = await axios.request(linkedinOptions);
        console.log('LinkedIn response:', linkedinResponse.data);
        
        const linkedinPosts = linkedinResponse.data.data
          ?.filter(post => post?.text || post?.resharedPost?.text)
          .map(post => ({
            text: post.text || post.resharedPost.text,
            network: 'linkedin'
          })) || [];
        
        allPosts.push(...linkedinPosts);
      } catch (error) {
        console.error('LinkedIn API Error:', error.message);
      }
    }

    // Twitter posts
    if (socialMedia.twitter_username) {
      try {
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
          
          console.log("twitterposts")
          console.log(twitterPosts)
        allPosts.push(...twitterPosts);
      } catch (error) {
        console.error('Twitter API Error:', error.message);
      }
    }

    // Facebook posts
    if (socialMedia.facebook_username) {
      try {
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
        console.log("FACEBOOK POSTS:", facebookPostResponse.data.results);
        
        const facebookPosts = facebookPostResponse.data.results
          ?.filter(post => post.message)  
          .map(post => ({
            text: post.message,
            network: 'facebook'
          })) || [];
        
        allPosts.push(...facebookPosts);
      } catch (error) {
        console.error('Facebook API Error:', error.message);
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Overall API Error:', error.message);
    return [];
  }
}





async function processEmployees(employees) {
  const results = [];

  for (const emp of employees) {
    try {
     
      let totalCategoryScore = 0;
      let validCategories = 0;
  
        let employeeName = emp['Employee Name (Last Suffix, First MI)'] ? 
        emp['Employee Name (Last Suffix, First MI)'] : 
        emp['Employee Name (Last Suffix,First MI)'];

      let splitName = employeeName?.includes(',') ? 
        employeeName.split(',') : 
        employeeName.split(' ');
 
      let firstName = splitName[0].trim();
      let lastName = splitName[1].trim();
      let email = emp['E-mail Address'] ? emp['E-mail Address'] : emp['Alternate Email'];
      let phone = emp['Home Phone (Formatted)'];
      const refinedPhone = "+" + phone.replace(/\D/g, "");
      let companyName = emp['Company Name'] ? emp['Company Name'] : emp['Company '];

     
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

      let twitterUsername = null;
      let linkedinUsername = null;
      let facebookUsername = null;

      console.log("PDL DATA")
      console.log(data?.data?.matches[0]?.data)
      
      if (data?.data?.matches[0]?.data?.linkedin_username) {
        linkedinUsername = data?.data?.matches[0]?.data?.linkedin_username;
      }
      if (data?.data?.matches[0]?.data?.twitter_username) {
        twitterUsername = data?.data?.matches[0]?.data?.twitter_username;
      }
      if (data?.data?.matches[0]?.data?.facebook_username) {
        facebookUsername = data?.data?.matches[0]?.data?.facebook_username;
      }

      if (!data?.data?.matches[0]?.data?.profiles) {
        continue;
      }


         const socialMedia = {
        linkedin_url: data?.data?.matches[0]?.data?.linkedin_url || null,
        linkedin_username: linkedinUsername || null,
        twitter_url: data?.data?.matches[0]?.data?.twitter_url || null,
        twitter_username: twitterUsername || null,
        facebook_url: data?.data?.matches[0]?.data?.facebook_url || null,
        facebook_username: facebookUsername || null
      };


      const allPosts = await fetchAllSocialMediaPosts(socialMedia);
 
      const categoryScores = {};
      let categoriesCount = 0;
    
      
      for (const [category, keywordMap] of Object.entries(keywordData)) {
        let categoryScore = 0;
    
      
        for (const [phrase, weight] of Object.entries(keywordMap)) {
           
            let totalCount = 0;
            for (const post of allPosts) {
                const cleanedText = cleanText(post.text);
                const matches = (cleanedText.match(new RegExp(phrase, 'g')) || []).length;
                totalCount += matches;
            }
            
            
            categoryScore += totalCount * weight;
        }
    
        categoryScores[category] = categoryScore;
        totalCategoryScore += categoryScore;
        validCategories++;
    }
    
 
    const overallScore = validCategories > 0 
        ? parseFloat(((totalCategoryScore / (validCategories * 100)) * 100).toFixed(2))
        : 0;

console.log("data")
console.log(categoryScores)
console.log(overallScore)

    results.push({
        name: emp['Employee Name (Last Suffix, First MI)'],
        email: emp['E-mail Address'],
        categoryScores,
        overallScore
    });

    } catch (e) {
      console.log(`Error processing employee: ${e.message}`);
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
    'lack of rest': 0,
    totalScore: 0,
    riskLevel: 'Low',
    overallScore: 0,
    categoryScores: {},
  };
}

function getLast90Days() {
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90); 
  return ninetyDaysAgo.toISOString().slice(0, 19).replace('T', ' '); 
}






function cleanText(text) {
  return text.toLowerCase().replace(/[^\w\s]/gi, '');
}
module.exports = { processEmployees };