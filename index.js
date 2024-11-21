/***
 * Using FS and path Module and readline Implement the following operations:
 *   1. Add a new task.
 *   2. View a list of tasks.
 *   3. Mark a task as complete.
 *   4. Remove a task.
 */

const readline = require('node:readline/promises');
const fs = require('node:fs');
const {stdin: input, stdout: output} = require('node:process');
const rl = readline.createInterface({input, output});
const PATH_DATA_DOT_JOSN = 'data.json';
const PATH_DEFAULT_DATA_DOT_JOSN = 'defaultData.json';

let menu=`
Day 2 Assignment (NodeJs Module #6)
 1. Add a new task.
 2. View a list of tasks.
 3. Mark a task as complete.
 4. Remove a task.
 5. Restore Default Data into tasks file

Yours Choice: `;

async function init(){
  // Step #1 Take User Choice
    let choice = await rl.question(menu, (answer)=>{            
      return answer;
    });

  // Step #2 Perform Action
    // console.log('choice is ', choice, typeof choice);
    choice = Number(choice);
    switch(choice){
      case 1:
        await inputTaskNameFromUser();
      break;
      case 2:          
        showTheListOfTasksToUser();
      break;
      case 3:
        // ask user which task to mark as complete and mark that
        await markTaskAsComplete();
      break;
      case 4:
        // ask user which task to remove and then remove it
        await removeATask();
      break;
      case 5:
        restoreDefaultDataIntoTasksFile();          
      break;
      default:
        console.log('\nError : Invalid Choice !');
    }


  // Step #3 Release resouces
    rl.close();
  
  // Step #4 
    console.log('\r\nThank You for using Alex21C Node App!');
}

init();


async function markTaskAsComplete(){
  // ask user about the task id      
    let taskIDToDelete = await rl.question('\nEnter Task ID You want to Mark as Complete (e.g. 1001, 1002 etc.) : ');
  try {

  // read tasks data into json file
    let fileJSONData = JSON.parse(fs.readFileSync(PATH_DATA_DOT_JOSN, 'utf-8'));

      if(! Object.keys(fileJSONData.tasks).includes(taskIDToDelete)){
        throw new Error('task does not exist!')
      }

    // mark as complete
      fileJSONData.tasks[taskIDToDelete].taskCompleted = true;

    // update the file 
      fs.writeFileSync(PATH_DATA_DOT_JOSN, JSON.stringify(fileJSONData));  

    console.log(`Task #${taskIDToDelete} Marked as Completed  Successfully !`);
    
  } catch (error) {
    console.log(`ERROR: Unable to Mark task #${taskIDToDelete}, as complete. ${error}`)
  }
  
}


async function removeATask(){
  // ask user about the task id      
    let taskIDToDelete = await rl.question('\nEnter Task ID You want to delete (e.g. 1001, 1002 etc.) : ');
  try {

  // read tasks data into json file
    let fileJSONData = JSON.parse(fs.readFileSync(PATH_DATA_DOT_JOSN, 'utf-8'));

      if(! Object.keys(fileJSONData.tasks).includes(taskIDToDelete)){
        throw new Error('task does not exist!')
      }

    // delete that particular id from json data 
      delete fileJSONData.tasks[taskIDToDelete];

    // update the file 
      fs.writeFileSync(PATH_DATA_DOT_JOSN, JSON.stringify(fileJSONData));  

    console.log(`Task #${taskIDToDelete} deleted  Successfully !`);
    
  } catch (error) {
    console.log(`ERROR: Unable to delete Task #${taskIDToDelete}, ${error}`)
  }
  
}

async function inputTaskNameFromUser(){
      // Input new task name from user
      let taskNameAndDescription = await rl.question('\nEnter Task Name & Description: ');
      // fetch existing data from data.json
        let fileJSONData = JSON.parse(fs.readFileSync(PATH_DATA_DOT_JOSN, 'utf-8'));

      // create new task object
        let newTask = {
          [fileJSONData.nextTaskID] : {
            taskNameAndDescription,
            taskCompleted: false
          }
        }
      
      // udpate file data.json
        fileJSONData.nextTaskID = fileJSONData.nextTaskID + 1;
        fileJSONData.tasks = {
          ...fileJSONData.tasks,
          ...newTask
        };

        try {
          fs.writeFileSync(PATH_DATA_DOT_JOSN, JSON.stringify(fileJSONData));  
          console.log('Yours new task has been saved Successfully into Database !');            
        } catch (error) {
          console.log('ERROR: Unable to yours new task into the database, please try again later!')
        }

      // Finally show the user as well on screen the list of all the tasks  
      // here i'm alrady having data so directly processing

}

function restoreDefaultDataIntoTasksFile(){
    // Restore Default Data into tasks file
    try {
      fs.writeFileSync(PATH_DATA_DOT_JOSN, fs.readFileSync(PATH_DEFAULT_DATA_DOT_JOSN, 'utf-8'));
      console.log('\nSuccessfully restored default data into tasks file!')  
    } catch (error) {
      console.log("\nERROR: unable to restore data, kindly try again after some time!");
    }
}
function showTheListOfTasksToUser(){
  // read data from json file
  // convert it into json
    let fileJSONData = JSON.parse(fs.readFileSync(PATH_DATA_DOT_JOSN, 'utf-8'));

  // iterate and show to user
    console.log('\r\nYOURS TASKS :\r\n');
    Object.entries(fileJSONData.tasks).forEach(([key,task])=>{

      console.log(`${task.taskCompleted ? '[X] ': ""}Task#${key}: ${task.taskNameAndDescription}`);
    })

}


