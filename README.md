# MongoDB LogFile Tail -f

## Usecase
- While i was using pymongo / motor to connect and run mongodb commands, I was unable to understand which line of code 
was executing lazily and which one was actually calling the driver / querying the db 
also, it was confusing how the cursor would not perform any operation until iterated through the for loop of results.
- `mongod` logs will be published to `$(brew --prefix)/var/log/mongodb/mongodb.log`
- we will just tail that file and grep through the logs to find respective invocations of our database/collection in the namespace.

## Other ways
- Mongodb by default stores all invocations / events into a profiler sort of a collection which can be queried using a long living cursor
- [mongotail](https://github.com/mrsarm/mongotail) uses that implementation
- [Database Profiler Documentation](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/)

## References
- [Medium: Implementing tail -f functionality efficiently](https://kodewithkamran.medium.com/implementing-tail-f-in-node-js-edeb412eb587)
