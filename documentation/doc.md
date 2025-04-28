## 

# HOPCo Frontend Test

Application

The application is built using Vue 3. It's built using [primevue](https://primevue.org/) components and tailwind css.
The reason why I chose to use primevue components is that it reduces development time, they provide consisency across the application, the have been tested and offer a lot of out of the box functionality that you do not have to think off e.g. accessibility and finally best practices have been put in place.

This app is current deployed live at: https://hopco-frontend-test.netlify.app/ 

The starting point of the application is the login page:
The login page consists of:

 1. username input field 
 2. password field
 3. button

To login we currently have 2 accounts
1. admin@matterhospital.com
2. admin@nairobihospital.com

NB: The password can be anything for now.

When the user logs in the account is stored on localstorage and we use this value to determine what table header elements to show. When you have loggedin successfully you'll be taken to the dashboard page.

Memory dump
https://app.eraser.io/workspace/6seFcsHBD281ATMuVna6?origin=share

## Dashboard Page
The dashboard page consists of 
1. The Header Nav bar: This would ideally contain the hospital name and we have a logout out button. Clicking on the logout button clears the localstorage and redirects you back to the login page.
2. Side Nav: The side nav contains the links to the other pages that are part of the application.
3. Table: This table is dynamically generated depending on the header fields. This table contains a text input filed per column that you can use to search (filter) the contents of that column. Also by clicking on the header you can be able to sort the table by whichever column you choose. A table row also contain a pencil icon that you can use for editing. It will the specific row and you can click on the tick to accept the change and they will be updated in real time. ( A copy of the updated data will now be stored on localstorage and persist the changes ). There is also a delete button denoted by the letter X and red background. this will remove the row contents )

## Inventory List Config Page
This page allows you to add, update or remove headings to the inventory table. This page contains a add new property button and when you click it a dialog will appear and you can create a new field that you would want to appear on the table. When you save it. It will appear on this list and on the table in the dashboard pages as well and in the adding of a new inventory item.

## Add Inventory Item Page
This page allows you to add a new item to the inventory table. The form input elements are dynamically generated from the headers available. Currently they are all just text input fields as we are not aware of the user i.e. are they tech savvy enough. Text inputs are simpler and more communicative.

## Project Structure Folder
cypress -> This is where our e2e tests live
mocks -> Contains mock files for our app for the 2 users with different lists and list litems
src -> Where the app is located
assets -> Contain our css files
components -> We have a common which represents reused components. Each component has it's own folder and it's own e2e tests written in vitest
composable -> This is for sharing reusable logic.
config -> This represents the config for certain elements.
constants -> This is where we keep all our magic strings for reusability and give more context.
helpers -> This is where we would have utility functions that are shared
layout -> This contains the different layouts for the app. We currently only have for the dashboard pages
services -> This is where the business logic is stored / happens
stores -> This is for maintaining state across the app and having a single source of truth that is reactive
types -> This is where we store our typescript types
views -> This contains the different pages of the application