'use strict';
const fs = require("fs")
const {bcryptData} = require("../helper")
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
    let dataUser = JSON.parse(fs.readFileSync("./user.json", "utf-8"))
    let refinedData = dataUser.map((el)=>{
      el.password = bcryptData(el.password)
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    
    await queryInterface.bulkInsert('Users', refinedData, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
