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
    let dataUserDetail = JSON.parse(fs.readFileSync("./userDetail.json", "utf-8"))
    let refinedData = dataUserDetail.map((el)=>{
     el.createdAt = el.updatedAt = new Date()
     return el
    })
    
    await queryInterface.bulkInsert('UserDetails', dataUserDetail, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserDetails', null, {})
  }
};
