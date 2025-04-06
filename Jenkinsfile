pipeline {
    agent any
    tools {
        nodejs 'Node18'
    }
    environment {
        SUPABASE_URL = credentials('supabase-url')
        SUPABASE_KEY = credentials('supabase-key')
        VERCEL_TOKEN = credentials('vercel-token')
        RAILWAY_TOKEN = credentials('railway-token')
    }
    stages {
        // Frontend (React) - Vercel
        stage('Frontend: Build & Test') {
            when {
                anyOf {
                    branch 'main'
                    branch 'server'
                }
                //changeset 'WebFrontend/**'
            }
            steps {
                dir('WebFrontend') {
                    bat 'npm install'
                    bat 'npm run build'
                    bat 'npm test'
                }
            }
        }
        stage('Frontend: Deploy Staging to Vercel') {
            when {
                branch 'server'
            }
            steps {
                dir('WebFrontend') {
                    bat 'npm install -g vercel'
                    bat 'vercel --token %VERCEL_TOKEN% --yes --scope slotzi deploy'
                }
            }
        }
        stage('Frontend: Deploy Production to Vercel') {
            when {
                branch 'main'
            }
            steps {
                dir('WebFrontend') {
                    bat 'npm install -g vercel'
                    bat 'vercel --token %VERCEL_TOKEN% --prod --yes --scope slotzi deploy'
                }
            }
        }

        // Backend (Node.js + Express) - Railway
        stage('Backend: Build & Test') {
            when {
                anyOf {
                    branch 'main'
                    branch 'server'
                }
                //changeset 'Backend/**'
            }
            steps {
                dir('Backend') {
                    bat 'npm install'
                    bat 'npm run build' // Remove if no build step
                    bat 'npm test'
                }
            }
        }
        stage('Backend: Deploy Staging to Railway') {
            when {
                branch 'server'
            }
            steps {
                dir('Backend') {
                    bat 'npm install -g railway'
                    bat 'railway login --token %RAILWAY_TOKEN%'
                    bat 'railway up --service your-staging-service --environment staging'
                }
            }
        }
        stage('Backend: Deploy Production to Railway') {
            when {
                branch 'main'
            }
            steps {
                dir('Backend') {
                    bat 'npm install -g railway'
                    bat 'railway login --token %RAILWAY_TOKEN%'
                    bat 'railway up --service your-prod-service --environment production'
                }
            }
        }

        // Mobile (React Native with Expo)
        stage('Mobile: Build & Test') {
            when {
                anyOf {
                    branch 'main'
                    branch 'server'
                }
                //changeset 'MobileFrontend/**'
            }
            steps {
                dir('MobileFrontend') {
                    bat 'npm install'
                    bat 'npm run build' // Remove if no build step
                    bat 'npm test'
                }
            }
        }
        stage('Mobile: Publish Expo Staging') {
            when {
                branch 'main'
            }
            steps {
                dir('MobileFrontend') {
                    bat 'npm install -g expo-cli'
                    bat 'expo login --username %EXPO_USERNAME% --password %EXPO_PASSWORD%'
                    bat 'expo publish --release-channel staging'
                }
            }
        }
        stage('Mobile: Publish Expo Production') {
            when {
                branch 'main'
            }
            steps {
                dir('MobileFrontend') {
                    bat 'npm install -g expo-cli'
                    bat 'expo login --username %EXPO_USERNAME% --password %EXPO_PASSWORD%'
                    bat 'expo publish --release-channel production'
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed!'
        }
        //failure {
            //mail to: 'vibuthi.20222168@iit.ac.lk', subject: "Build Failed: ${env.JOB_NAME}", body: "Check ${env.BUILD_URL}"
        //}
    }
}
