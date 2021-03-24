require('dotenv/config');
var AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_Region });
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

// setup instance params

exports.requestSpotInstances = async () => {
    console.log("requesting : spotInstanceId");
    const params = {
        InstanceCount: 1,
        DryRun: true,
        InstanceInterruptionBehavior: "terminate",
        Type: "one-time",
        LaunchSpecification: {
            ImageId: "ami-0a9aa04303cc8c65f",
            KeyName: "shivCloudKey1",
            InstanceType: "g4dn.xlarge",
            Placement: {
                AvailabilityZone: "ap-southeast-1a"
            }
        },
        SpotPrice: "0.45"
    };
    ec2.requestSpotInstances(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            return {
                message: "Failed",
                data: err
            }
        } // an error occurred
        else {
            console.log("Success fully launched a new instance")
            return {
                message: "Success",
                data: data.SpotInstanceRequests ? [0] : "Failed"
            }
        }         // successful response
    });
}
exports.describeSpotInstanceRequests = async (spotInstanceId) => {
    console.log("Describeing :", spotInstanceId);
    var params = {
        SpotInstanceRequestIds: []
    };
    params.SpotInstanceRequestIds.push(spotInstanceId);
    ec2.describeSpotInstanceRequests(params, function (err, data) {
        if (err) {
            return {
                message: "Failed",
                data: err
            }
        } else {
            return {
                message: "Success",
                data: data.SpotInstanceRequests[0]
            }
        }
    })
}
