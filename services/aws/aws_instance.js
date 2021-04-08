require('dotenv/config');
var AWS = require('aws-sdk');
const { Promise } = require('mongoose');

AWS.config.update({ region: process.env.AWS_Region });
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

// setup instance params

exports.requestSpotInstances = async (ami) => {

    console.log("requesting : spotInstanceId");
    const params = {
        InstanceCount: 1,
        DryRun: false,
        InstanceInterruptionBehavior: "terminate",
        Type: "one-time",
        LaunchSpecification: {
            ImageId: ami,
            KeyName: "shivCloudKey1",
            InstanceType: "g4dn.xlarge",
            Placement: {
                AvailabilityZone: "ap-southeast-1a"
            }
        },
        SpotPrice: "0.45"
    };
    // g4dn.xlarge
    const promise = new Promise(function (resolve, reject) {
        ec2.requestSpotInstances(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                resolve(null)
            } // an error occurred
            else {
                resolve(data.SpotInstanceRequests[0].SpotInstanceRequestId)
            }        // successful response
        });
    })
    return promise
}

exports.waitForRequestTofullfill = async (requestId) => {
    console.log("Waiting for : ", requestId)
    let instanceId = "";
    while (instanceId === "") {

        const state = await this.describeSpotInstanceRequests(requestId)
        if (state) {
            instanceId = state
        }
        sleep(10000)
    }
    return instanceId;
}




exports.describeSpotInstanceRequests = async (spotInstanceId) => {
    var params = {
        SpotInstanceRequestIds: [],
        DryRun: false
    };
    params.SpotInstanceRequestIds.push(spotInstanceId);
    console.log("Describeing :", params.SpotInstanceRequestIds[0]);

    const promise = new Promise(function (resolve, reject) {
        ec2.describeSpotInstanceRequests(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                resolve(null)
            }
            else {
                resolve(data.SpotInstanceRequests[0].InstanceId)
            }
        })
    })
    return promise
}

exports.waitForInstanceToInitialize = async (instanceId) => {
    let instanceState = "";
    while (instanceState === "") {
        const state = await this.describeInstances(instanceId)
        if (state) {
            const { State } = state
            if (State.Code === 16) {
                instanceState = State.Name
            }
        }
        sleep(20000)
    }
    return instanceState
}

exports.describeInstances = async (instanceId) => {
    const params = {
        InstanceIds: [instanceId]
    };
    if (instanceId) {
        const promise = new Promise(function (resolve, reject) {
            let instanceRunning = false
            ec2.describeInstances(params, function (err, data) {
                if (err) {
                    resolve(null)
                }
                if (data) {
                    resolve(data.Reservations[0].Instances[0])
                }
            });
        })
        return promise
    } else {
        return ({
            message: "Failed",
            data: "No InstanceId Provided"
        })
    }
}

exports.terminateInstances = async (instanceId) => {
    var params = {
        InstanceIds: []
    };
    params.InstanceIds.push(instanceId)
    const promise = new Promise(function (resolve, reject) {
        ec2.terminateInstances(params, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve("Success")
            }
        })
    });
    return promise
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}