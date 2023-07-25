const fs = require('fs');
const readline = require('readline');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

//const filePath = './log_files/api-dev-out.log';
const filePath = './log_files/api-prod-out.log';
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
let request_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
let method_map = new Map();
let total_lines = 0;
const rl_temp = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity // To handle Windows line endings (\r\n)
}); 
rl_temp.on('line', (line) => {
      total_lines++;
    }
);
rl_temp.on('close', () => {
  console.log('total lines'+total_lines);
  bar1.start(total_lines, 0);
  
});

let line_count = 0;
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
    line_count++;
    bar1.update(line_count);
  
    
    // console.log('Line:', line);
    if (regexPattern.test(line)) {
        //console.log("Valid date format.");
        for(let i in request_methods){
          if(line.includes(i) && line.includes(':ffff')){
            let arr = line.split('HTTP/1.1')
            //console.log(arr[1])
            try{
              let link = arr[1].replace('"', '')
              if(link.length >= 3){
                link = link.trim()
                let meth = link.substring(0, 3)
                if(method_map.has(meth)){
                  method_map.set(meth, method_map.get(meth)+1)
                }else{
                  method_map.set(meth, 1)
                }
                valid++;
                //console.log(meth)
              }
              //console.log(link)
            }catch(e){
              //console.log(e)
            }
          }
        }

      } else {
        invalid++;
        
      }
      prev_prev = prev
      prev = line
  });
  
  // Event listener for the end of file
  rl.on('close', () => {
    bar1.stop();
    console.log('Reading file completed.');
    console.log("valid",valid )
    console.log("invalid",invalid )
    console.log(method_map)
    console.log('total lines'+total_lines);

  });

