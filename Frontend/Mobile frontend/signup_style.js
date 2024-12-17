import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2634',
  },
  header: {
    padding: 16,
  },
  headerText: {
    color: '#89a3c2',
    fontSize: 16,
    fontWeight: '600',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    // width and height are set dynamically in the component
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  emailButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dividerText: {
    color: '#89a3c2',
    textAlign: 'center',
    marginVertical: 8,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#89a3c2',
    fontSize: 14,
  },
  signInText: {
    color: '#89a3c2',
    textDecorationLine: 'underline',
  },
});