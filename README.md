## Work in Progress!  RoleBasedEcom


## Table of contents

* [Requirements]
* [Download and Access]
* [Create Backend]
* [Create Angular App (Frontend)]
  
## Requirements
1. [download and install Node.js](https://nodejs.org/en/download/).
Node.js 18 or higher is required.

2. [download and install vscode](https://code.visualstudio.com/download)

3. [install angular}(https://angular.dev/installation)
  follows steps provide in Docs
   => npm install -g @angular/cli

## Download and Access

Create one folder open VScode in that folder and clone Crud App repo. in your folder.

## Git Commands for help
* git --version //check git version
* git clone https://<Git Url> //copy url from github and create clone of repo.
* ls //list files
* ls -ah //hidden files
* git status //check project files status
* git add .  ===  >git add index.html  //add all files at a time or single file
* git commit -m "Add new paragraph" //commit changes in files with meaningful comment in ""
* git push -u origin main //first use this command for upadate this changes in your github repository
* git push // when first time we use < -u flag > then after there is no need write full command
* git remote add origin <url> //new repo. add
* git remote -v //to verify remote
* git branch //to check branch
* git branch -M main //rename branch name
* git push -u origin main //future shortcut only type >git push
* git checkout -b feature1 //create new branch
* git checkout main //get reach to previous branch
* git branch
* git branch -d feature1 //detele branch name current branch not deleted but other will be deleted
* :q  //exit terminal
* git reset //undo after add . changes in all files  & git reset <file name>//undo for singles file
* git reset HEAD~1 //undo after commit at 1 time
* fork //copy others project into your account
* git log //view all commits
* git rm src/app/directives/directives.directive.spec.ts //for removing copy and paste files

## How to run this project
cd backend ==> npm start
for angular app ==> npm start/ng serve 

**PROTIP** Be sure to read the [migration guide to v5](https://expressjs.com/en/guide/migrating-5)
