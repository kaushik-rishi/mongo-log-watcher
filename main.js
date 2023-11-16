const fs = require("fs");
const {log_file, namespace} = require("./config.json");

/**
 * MongoDB log file is found @ "$(brew --prefix)/var/log/mongodb/mongo.log"
 */
let log_file_dev = "./sample-file.txt"
log_file_dev = log_file;

fs.watchFile(log_file_dev, {persistent: true, interval: 100}, (currentStat, prevStat) => {
    if (currentStat.size === prevStat.size) {
        return;
    }
    if (currentStat.size < prevStat.size) {
        console.log("looks like the log file has been removed/truncated");
        return;
    }

    const newBytes = currentStat.size - prevStat.size;
    const buffer = Buffer.alloc(newBytes);
    // console.log(newBytes, buffer.length);

    let lastReadByte = prevStat.size;

    fs.open(log_file_dev, (err, fd) => {
        fs.read(fd, buffer, 0, newBytes, lastReadByte, (err, bytesRead) => {
            // console.log(localBuffer.toString());
            let operationMetadataList = buffer.toString().trim().split("\n");
            for (let i in operationMetadataList) {
                operationMetadataList[i] = operationMetadataList[i].trim();
            }

            let jsonOps = [];
            for (let op of operationMetadataList) {
                jsonOps.push(JSON.parse(op));
            }

            for (let jsonOp of jsonOps) {
                if (!jsonOp?.["attr"]) {
                    continue;
                }
                let ns = jsonOp["attr"]["ns"];
                if (ns === namespace) {
                    let queryInfo = jsonOp["attr"];
                    try {
                        const {
                            type, command
                        } = queryInfo;
                        console.log(`type: ${type} | command: ${JSON.stringify(command)}`);
                    } catch (err) {
                        console.log("unable to parse the query");
                        console.log(JSON.stringify(jsonOp["attr"], null, 4));
                    }
                    // console.log(JSON.stringify(jsonOp["attr"], null, 4));
                }
                /*
                {
                    "type": "remove",
                    "ns": "myDB.usersCollection",
                    "appName": "mongosh 2.0.2",
                    "command": {
                        "q": {
                            "name": "asda"
                        },
                        "limit": 0
                    },
                    "planSummary": "COLLSCAN",
                    "keysExamined": 0,
                    "docsExamined": 0,
                    "ndeleted": 0,
                    "numYields": 0,
                    "locks": {
                        "ParallelBatchWriterMode": {
                            "acquireCount": {
                                "r": 1
                            }
                        },
                        "FeatureCompatibilityVersion": {
                            "acquireCount": {
                                "w": 1
                            }
                        },
                        "ReplicationStateTransition": {
                            "acquireCount": {
                                "w": 1
                            }
                        },
                        "Global": {
                            "acquireCount": {
                                "w": 1
                            }
                        },
                        "Database": {
                            "acquireCount": {
                                "w": 1
                            }
                        },
                        "Collection": {
                            "acquireCount": {
                                "w": 1
                            }
                        }
                    },
                    "flowControl": {
                        "acquireCount": 1
                    },
                    "storage": {},
                    "remote": "127.0.0.1:51708",
                    "durationMillis": 0
                }

                 */
            }
        });
    });
});

/**
fs.open("./sample-file.txt", (err, fd) => {
    console.log("file opened with fd :", fd);
    setTimeout(() => {
        fs.open("./sample-file.txt", (err, new_fd) => {
            console.log("opened another fd for the same file :", new_fd);
        });
    }, 10*1000);

    setTimeout(() => {
        fs.close(fd, () => {
            console.log("file descriptor closed successfully");
        });
    }, 50 * 1000);
});
*/

// fs.open(log_file, (err, fd) => {
//     fs.read(fd, (err, bytesRead, buffer) => {
//         console.log(bytesRead, buffer);
//         console.log(buffer.toString());
//     })
// });
