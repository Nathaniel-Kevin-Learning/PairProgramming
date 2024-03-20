'use strict';
const fs = require("fs")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let dataTag = JSON.parse(fs.readFileSync("./tag.json", "utf-8"))
    let refinedData = dataTag.map((el)=>{
     el.createdAt = el.updatedAt = new Date()
     return el
    })
    
    await queryInterface.bulkInsert('Tags', refinedData, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Tags', null, {})
  }
};
