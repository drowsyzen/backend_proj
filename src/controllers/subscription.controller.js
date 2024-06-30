import mongoose, { Mongoose, Schema } from "mongoose";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { Subscription } from "../models/subscription.models.js"
import ApiError from "../utils/apiError.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const usr = req.user?.id
    const channel = req.body.channel

    console.log('usr',usr)

    const subscriptiondata = await User.aggregate([
        {
            $match : {
                username : channel
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : '_id',
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $addFields : {
                isSubscribed : {
                    $cond : {
                        if : {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        // {
        //     $project : {
        //         fullName : 1,
        //         username : 1,
        //         email : 1,
        //         isSubscribed : 1,
        //     }
        // }
    ])

    console.log(subscriptiondata,"subscriptiondata")

    if (!subscriptiondata[0].isSubscribed){
        console.log(subscriptiondata[0].isSubscribed,"subscr")
        console.log("adding user")
        const subobj = await Subscription.create({
            channel : subscriptiondata[0]._id,
            subscriber : req.user?._id
        })

        return res.status(200).json(
            new ApiResponse(208,"subobj","subscribed Successfully")
        )
    }
    else {
        console.log(subscriptiondata[0].isSubscribed,"subscr")
        console.log("deleting user")

        await Subscription.deleteOne({
            channel : subscriptiondata[0],
            subscriber : req.user
        })  

        return res.status(200).json(
            new ApiResponse(208,"pass","Unsubscribed Successfully")
        )
    }
    

})

const subscribersList = asyncHandler( async (req, res) => {
    const channel = req.body.channel

    if (!channel){
        throw new ApiError(401,"channel is None")
    }
    
    const subscriberdata = await User.aggregate([
        {
            $match : {
                username : channel
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : '_id',
                foreignField : "channel",
                as : "subscribers",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            // localField : "channel",
                            localField : "subscriber",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullName : 1,
                                        username : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner : {
                                $first : "$owner"
                            }
                        }
                    },
                    {
                        $project : {
                            owner : 1,
                            
                        }
                    }
                ]
            }
        },
        {
            $project : {
                subscribers : 1,
            }
        }
    ])

    console.log('subscriberdata.subscribers',subscriberdata)

    return res
    .status(200)
    .json(
        new ApiResponse(207,subscriberdata[0].subscribers,"subscribers list found success fully")
    )

})

const channelList = asyncHandler( async (req, res) => {

    const channel = req.body.channel

    if (!channel){
        throw new ApiError(401,"channel is None")
    }
    
    const channelData = await User.aggregate([
        {
            $match : {
                username : channel
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : '_id',
                foreignField : "subscriber",
                as : "channels",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "channel",
                            // localField : "subscriber",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullName : 1,
                                        username : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner : {
                                $first : "$owner"
                            }
                        }
                    },
                    {
                        $project : {
                            owner : 1,
                            
                        }
                    }
                ]
            }
        },
        {
            $project : {
                channels : 1,
            }
        }
    ])

    // console.log('subscriberdata.subscribers',subscriberdata)

    return res
    .status(200)
    .json(
        new ApiResponse(207,channelData[0].channels,"channel list found success fully")
    )    

})

export {
    toggleSubscription,
    subscribersList,
    channelList
}