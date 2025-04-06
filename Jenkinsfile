pipeline {
    agent any
    tools {
        nodejs 'Node18'
    }
    environment {
        SUPABASE_URL = credentials('https://dmeqashshebynxjenhfb.supabase.co')
        SUPABASE_KEY = credentials('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZXFhc2hzaGVieW54amVuaGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNjE1ODEsImV4cCI6MjA1NDkzNzU4MX0.DZJLgvViYYgvQTFYWaduVkiZRcHb5IBptGss4aINg2Q')
        VERCEL_TOKEN = credentials('MX8ck7rk6XVsgJ6CzCZzQhAA')
        RAILWAY_TOKEN = credentials('86be8354-ee83-49e2-87a7-e245fedbeca7')
    }
    stages {
        // Frontend (React) - Vercel
        stage('Frontend: Build & Test') {
            when {
                anyOf {
                    branch 'main'
                    branch 'server'
                }
                changeset 'WebFrontend/**'
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
                    bat 'vercel --token %VERCEL_TOKEN% --yes --scope your-team-name deploy'
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
                    bat 'vercel --token %VERCEL_TOKEN% --prod --yes --scope your-team-name deploy'
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
                changeset 'Backend/**'
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
                changeset 'MobileFrontend/**'
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
