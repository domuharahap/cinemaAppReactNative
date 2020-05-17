module.exports = {
    react : {
        debug : false,

        lifecycle : {
            /**
             * Decide if you want to see Update Cycles as well
             */
            includeUpdate: false,

            /**
             * Filter for Instrumenting Lifecycle of Components / True = Will be instrumented
             */
            instrument: (filename) => {
                return false;
            }
        },

        input : {
            /**
             * Allows you to filter the instrumentation for touch events, refresh events and picker events in certain files
             * True = Will be instrumented
             */
            instrument: (filename) => {
                return false;
            }
        }
    },
    android : {
        // Those configs are copied 1:1
        config : `
        dynatrace {
            configurations {
                defaultConfig {
                    autoStart {
                      applicationId '511b8129-7ff5-4810-be5f-9c377f5b40df'
                      beaconUrl 'https://bf61178oyc.bf.dynatrace.com/mbeacon'
                    }
                    debug.agentLogging false
                    debug.certificateValidation false
                }
            }
        }
        `
    },
    ios : {
        // Those configs are copied 1:1
        config : `
        <key>DTXApplicationID</key>
        <string>511b8129-7ff5-4810-be5f-9c377f5b40df</string>
        <key>DTXBeaconURL</key>
        <string>https://bf61178oyc.bf.dynatrace.com/mbeacon</string>
        <key>DTXLogLevel</key>
        <string>ALL</string>
        <key>DTXUserOptIn</key>
        <true/>
        `
    }


}
