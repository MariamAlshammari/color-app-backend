'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const server = express();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;
mongoose.connect('mongodb://localhost:27017/colorsdb', { useNewUrlParser: true, useUnifiedTopology: true });


const colorSchema = new mongoose.Schema({
    title: String,
    imageUrl: String
})

const UserSchema = new mongoose.Schema({
    email: String,
    colors: [colorSchema]
})

const UserModal = mongoose.model('users', UserSchema);

function seedUsers() {
    let mariam = new UserModal({
        email: 'malshammari37@gmail.com',
        colors: [
            {
                title: 'Black',
                imageUrl: 'http://www.colourlovers.com/img/000000/100/100/Black.png'
            },
            {
                title: 'dutch teal',
                imageUrl: 'http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png'
            }

        ]
    })
    let razan = new UserModal({
        email: 'quraanrazan282@gmail.com ',
        colors: [
            {
                title: 'Black',
                imageUrl: 'http://www.colourlovers.com/img/000000/100/100/Black.png'
            },
            {
                title: 'dutch teal',
                imageUrl: 'http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png'
            }

        ]
    })
    razan.save();
}
seedUsers();

class Color{
    constructor(title,imageUrl){
        this.title=title,
        this.imageUrl=imageUrl
    }
}
//localhost:3006/colors?userEmail=malshammari37@gmail.com
server.get('/colors', async(req, res)=> {
    let userEmail = req.query.userEmail;
    // UserModal.find({ email: userEmail }, (error, userData) => {
    //     if (error) {
    //         res.send('error')
    //     } else {
    //         res.send(userData[0].colors)
    //     }
    // })
    
    let ApiData=await axios.get('https://ltuc-asac-api.herokuapp.com/allColorData')
    let reqData=ApiData.data.map(item =>{
        return new Color(item.title,item.imageUrl)

    })
res.send(reqData);
})

server.post('/addfav', addhandler) 
function addhandler(req,res){
    let userEmail = req.query.userEmail;
    UserModal.find({ email: userEmail }, (error, userData) => {
        if (error) {
            res.send('error')
        } else {
            userData[0].colors.push(
                {
                    title:title,
                    imageUrl:imageUrl
                }
            )
            userData[0].save();
            res.send(userData[0].colors)
        }
    })}

    server.delete('/deletecolor', deletehandler) 

function deletehandler(req,res){
    let userEmail = req.query.userEmail;
    let colorid=Number(req.query.index)
    UserModal.find({ email: userEmail }, (error, userData) => {
        if (error) {
            res.send('error')
        }
         else {
            let newcolors=userData[0].colors.filter((item,index)=>{
                if(index!== colorid){return item}
            })

            userData[0].colors=newcolors
            
            userData[0].save();
            res.send(userData[0].colors)
        }
    })}
    // server.put('/updatcolors', updatcolors) 

    // function updatcolors(req,res){
    //     let {userEmail,title,imageUrl} = req.body;
    //     let colorid=Number(req.query.index)
    //     UserModal.find({ email: userEmail }, (error, userData) => {
    //         if (error) {
    //             res.send('error')
    //         }
    //          else {
    //             let newcolors=userData[0].colors.filter((item,index)=>{
    //                 if(index!== colorid){return item}
    //             })
    
    //             userData[0].colors=newcolors
                
    //             userData[0].save();
    //             res.send(userData[0].colors)
    //         }
    //     })}
    // }



server.get('/', test)
function test(req, res) {
    res.send('all good')
}
server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
});


