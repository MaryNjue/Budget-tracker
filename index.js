import fs from 'fs';
import { Command } from "commander";
import chalk from 'chalk';
import { isUtf8 } from 'buffer';

const program = new Command();

program.name("Budget Tracker") .description("A budget tracking app that adds item, deletes item, updates item, and gets item").version("1.0.0");


program.command("new")
.description("Adds a new item")
.option("-t | --title <value>", "title of the new item to be added")
.option("-q | --quantity <value>", "quantity of the item")
.option("-p | --price <value>", "price per quantity of the item")
.action(function(option){
    const title = option.title;
    const quantity = option.quantity;
    const price = option.price;

    const newItem = {
        title : title,
        quantity : quantity,
        price : price 
    }
  
    const loadedItems = fs.readFileSync ('./data/items.json', "utf-8");
    let goods;
    if (!loadedItems){
        goods =[];
    }
    goods = JSON.parse(loadedItems); 
    const items = JSON.parse(loadedItems);

    const itemExists = goods.find((currentItem) => currentItem.title === title);
    if (itemExists) {
        console.log (chalk.bgRed(`Item with '${title}' already exists'`))
        return;
    }

    items.push(newItem);
    fs.writeFileSync("./data/items.json", JSON.stringify(items));
    console.log(chalk.bgGreen(`New Item added Successfully!!!`))


});

//Get all items

program.command("read")
.description("Displays all the Items or a specific item using t flag") 
.option("-t, --title <value>","title of the item to be read" )
.action(function(options) {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/items.json", isUtf8);
    const  items = JSON.parse(loadedItems);

    if (items.length === 0){
        console.log(chalk.bgYellow("You don't have any items yet"))
        return;
    }

    if (title) {
        const item = items.find((currentItem) => currentItem.title ===title);
        if (item) {
            console.log('Item:', item.title)
            console.log('------------')
            console.log('Quantity:',item.quantity)
            console.log('--------------')
            console.log('Price:',item.price);
            return
        }
        console.log(chalk.bgRed(`No item with title '${title}'`))
        return;
    }

    items.forEach((currentItem) =>{
        console.log(chalk.bgBlue("_______"))
        console.log('Item:',currentItem.title)
        console.log("------------")
        console.log('Quantity:',currentItem.quantity)
        console.log("------------")
        console.log('Price:',currentItem.price);
        console.log(chalk.bgBlue("_______\n"))
    });

});

//Delete item
program.command("delete")
.description("deletes a specified item")
.option("-t, --title <value>", "title of the item to be deleted")
.action(function(options){
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/items.json");
    const items = JSON.parse(loadedItems);
    if (items.length === 0){
        console.log(chalk.bgYellow('Nothing to delete'));
        return;
    }
     const remainingItems = items.filter((currentItem) => currentItem.title !== title);
     if (remainingItems.length === items.length){
        console.log(chalk.bgRed(`Could not delete item '${title}'. It doesn't exist`))
        return;
     }
     fs.writeFileSync("./data/items.json", JSON.stringify(remainingItems));
     console.log(chalk.bgGreen(`Note with title "${title}" is deleted succesfully`))


})


program.parse(process.argv);
