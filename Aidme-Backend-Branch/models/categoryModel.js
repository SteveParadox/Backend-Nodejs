const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema({
  erranderJobs: [],
})

const Categories = mongoose.model("Categories", CategorySchema);

module.exports = Categories;


// What happens here are kindof useEffect shit. when we first lauch the app we should persist some data to the database

//Add erranderJobs
function ErranderJobs() {
    const erranderData = [
        {
            "task": "Cleaning",
            "perhour": "$10"
        },
        {
            "task": "Delivery & Errands",
            "perhour": "$10"
        },
        {
            "task": "Handyman",
            "perhour": "$10"
        },
        {
            "task": "Moving & Packing",
            "perhour": "$10"
        }, 
        {
            "task": "Furniture Assembly",
            "perhour": "$10"
        },
        {
            "task": "Mounting & Installation",
            "perhour": "$10"
        },
        {
            "task": "Personal Assistant",
            "perhour": "$10"
        },
        {
            "task": "Home Improvement",
            "perhour": "$10"
        },
        {
            "task": "Events & Photography",
            "perhour": "$10"
        },
        {
            "task": "Virtual & Online Tasks",
            "perhour": "$10"
        },
        {
            "task": "Fitness & Wellness",
            "perhour": "$10"
        },
        {
            "task": "Pet Services",
            "perhour": "$10"
        },
        {
            "task": "Elder Care & Companionship",
            "perhour": "$10"
        }
    ]

    Categories.find({}).then(res => {
        if(res.length) {
            return;
        }

        const create = new Categories({
           erranderJobs: erranderData
        })
        create.save();
    })

}

ErranderJobs()
