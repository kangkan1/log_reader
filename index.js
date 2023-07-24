const fs = require('fs');
const readline = require('readline');

const filePath = './log_files/api-dev-out.log';
let regexPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2}:/;
//regexPattern = /::ffff:/

// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//   } else {
//     console.log('File contents:');
//     console.log(data);
//   }
// });

const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity // To handle Windows line endings (\r\n)
  });
  
  // Event listener for each line
  let valid = 0;
  let invalid = 0;
  let prev = ''
  let prev_prev =  ''
  rl.on('line', (line) => {
    // console.log('Line:', line);
    if (regexPattern.test(line)) {
        console.log("Valid date format.");
        if(line.includes("GET") || line.includes("POST") || line.includes("PUT") || line.includes("DELETE")){
            let arr = line.split("GET")
            let link = arr[1].split('"')
            console.log(link[1])
        }
        // console.log("valid")
        // valid++;
        //console.log('Line:', line);
      } else {
        console.log("Invalid date format.");
        invalid++;
        
        // console.log('Line:');
        // console.log(prev_prev);
        // console.log(prev);
        // console.log(line);
      }
      prev_prev = prev
      prev = line
  });
  
  // Event listener for the end of file
  rl.on('close', () => {
    console.log('Reading file completed.');
    console.log("valid",valid )
    console.log("invalid",invalid )
  });

