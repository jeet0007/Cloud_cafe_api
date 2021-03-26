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
                resolve({
                    message: "Failed",
                    data: err
                })
            } // an error occurred
            else {
                console.log("Success fully launched a new instance", data)
                resolve({
                    message: "Success",
                    data: data.SpotInstanceRequests[0].SpotInstanceRequestId
                })
            }        // successful response
        });
    })
    return promise
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
                resolve({
                    message: "Failed",
                    data: err
                })
            }
            else {
                console.log("Describe request result : ", data.SpotInstanceRequests[0])
                resolve({
                    message: "Success",
                    data: data.SpotInstanceRequests[0].InstanceId
                })
            }
        })
    })
    return promise
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
                    resolve({
                        message: "Failed",
                        data: err
                    })
                }
                if (data) {
                    console.log("List of reservations", data.Reservations[0])
                    resolve({
                        message: "Success",
                        data: data.Reservations[0].Instances[0]
                    })
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
    ec2.terminateInstances(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }                            // successful response
        /*
        data = {
            TerminatingInstances: [
            {
            CurrentState: {
            Code: 32, 
            Name: "shutting-down"
            }, 
            InstanceId: "i-1234567890abcdef0", 
            PreviousState: {
            Code: 16, 
            Name: "running"
            }
            }
            ]
        }
        */
    });
}
