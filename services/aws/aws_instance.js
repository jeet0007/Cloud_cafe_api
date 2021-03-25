require('dotenv/config');
var AWS = require('aws-sdk');
const { Promise } = require('mongoose');

AWS.config.update({ region: process.env.AWS_Region });
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

// setup instance params

exports.requestSpotInstances = async (instanceId) => {
    console.log("requesting : spotInstanceId");
    const params = {
        InstanceCount: 1,
        DryRun: false,
        InstanceInterruptionBehavior: "terminate",
        Type: "one-time",
        LaunchSpecification: {
            ImageId: "ami-0958df9e9271ffe62",
            KeyName: "shivCloudKey1",
            InstanceType: "g4dn.xlarge",
            Placement: {
                AvailabilityZone: "ap-southeast-1a"
            }
        },
        SpotPrice: "0.45"
    };
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
    console.log("Describeing :", spotInstanceId);
    var params = {
        SpotInstanceRequestIds: [],
        DryRun: false
    };
    const promise = new Promise(function (resolve, reject) {
        params.SpotInstanceRequestIds.push(spotInstanceId);
        ec2.describeSpotInstanceRequests(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                resolve({
                    message: "Failed",
                    data: err
                })
            }
            else {
                console.log("Successfully launched a new instance")
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
        InstanceIds: []
    };
    params.InstanceIds.push(instanceId)
    const promise = new Promise(function (resolve, reject) {
        ec2.describeInstances(params, function (err, data) {
            if (err) {
                resolve({
                    message: "Failed",
                    data: err
                })
            }
            if (data) {
                resolve({
                    message: "Success",
                    data: data.Reservations[0].Instances[0]
                })
            }
        });
    })
    return promise
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
