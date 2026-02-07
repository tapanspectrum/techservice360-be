pipeline {
    agent any

    environment {
        IMAGE_NAME = 'techservice360-be'
        APP_PORT = '4001'
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tapanspectrum/fetchdial-be.git',
                    credentialsId: 'jenkin-github-latest-username-password'
            }
        }

        stage('Verify Workspace') {
            steps {
                sh '''
                    echo "Current directory:"
                    pwd
                    echo "Files:"
                    ls -la
                    test -f Dockerfile
                '''
            }
        }

        stage('Generate Container Name') {
            steps {
                script {
                    def gitHash = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()

                    env.CONTAINER_NAME = "${IMAGE_NAME}-${BUILD_NUMBER}-${gitHash}"
                    echo "Container Name: ${env.CONTAINER_NAME}"
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -t $IMAGE_NAME:latest .
                '''
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                    echo "Stopping containers using port $APP_PORT..."
                    docker ps -aq --filter "publish=$APP_PORT" | xargs -r docker rm -f

                    echo "Removing container with same name if exists..."
                    docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                    echo "Starting new container..."
                    docker run -d \
                      --name $CONTAINER_NAME \
                      -p $APP_PORT:4001 \
                      -e NODE_ENV=$NODE_ENV \
                      $IMAGE_NAME:latest
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
            echo "🚀 App running on port $APP_PORT"
        }
        failure {
            echo "❌ Deployment failed"
        }
        always {
            echo "📦 Docker containers:"
            sh 'docker ps -a'
        }
    }
}
