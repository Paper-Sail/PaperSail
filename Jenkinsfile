def secrets = [
        text : [
            sentry_dsn: 'sentry_dsn',
            sentry_public_dsn: 'sentry_public_dsn'
        ]
    ]

aslApp {
    slack_channel='#infra'
    group='papersail'
    owner='veryveryshort'
    apps=[
        [
            name:'papersail',
            branch: 'artestudio',
            env: 'prod',
            deploy: [
                timeoutms: 360000
            ],
            vars: [
		        hc_path: '/',
			vhost: 'papersail.lab.arte.tv'
	        ],
            secrets: secrets
        ]            
    ]
}
