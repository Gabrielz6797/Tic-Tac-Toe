const {By, Key, Builder} = require ("selenium-webdriver");
require("chromedriver");

async function test_case(){
    let driver = await new Builder().forBrowser("chrome").build();
    
    await driver.get("https://titanic.ecci.ucr.ac.cr/~eb98755/Tic-Tac-Toe/");

    await driver.findElement(By.name("player")).sendKeys("Test");
    await driver.findElement(By.xpath("//*[@id='btn']/form[1]/button")).click();

    await driver.findElement(By.name("cell")).click();
    await driver.findElement(By.xpath("//*[@id='btn']/button")).click();

    console.log(await driver.findElement(By.xpath("//*[@id='0 0']")).getText());

    if(await driver.findElement(By.xpath("//*[@id='0 0']")).getText() === "X"){
        console.log("Test #1 success");
    } else{
        console.log("Test #1 failed");
        return;
    }

    await driver.get("https://titanic.ecci.ucr.ac.cr/~eb98755/Tic-Tac-Toe/");

    await driver.findElement(By.xpath("//*[@id='btn']/form[2]/button")).click();

    if(await driver.getTitle() === "Tic-Tac-Toe scores"){
        console.log("Test #2 success");
    } else{
        console.log("Test #2 failed");
        return;
    }

    driver.quit();

}
test_case();