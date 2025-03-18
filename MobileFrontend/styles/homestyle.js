import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Top navigation header styles
  topNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('5%'),  // Increased from hp('1%') to move it down
    paddingBottom: hp('1.5%'),
    backgroundColor: '#ffffff',
  },
  spacer: {
    flex: 1,
  },
  topNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
  },
  profileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
  },
  topNavButtonText: {
    color: '#420F54',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    marginLeft: wp('1.5%'),
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: hp('4%'),
  },
  animationContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('0%'),
  },
  animation: {
    width: wp('140%'),
    height: wp('140%'),
  },
  textContainer: {
    alignItems: 'center',
    width: wp('90%'),
    marginVertical: hp('1%'),
    marginTop: hp('-15%')
  },
  chooseText: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#272D2F',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtaglineText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Bold',
    color: '#420F54',
    marginTop: hp('1.5%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('4%'),
    marginVertical: hp('2%'),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  categoryGridContainer: {
    width: wp('90%'),
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  // Special container for single search result
  singleResultContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
  },
  categoryGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
    width: '100%',
  },
  categoryButton: {
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),     
    width: wp('42%'),
    height: hp('18%'),           
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: wp('1%'),
    margin: wp('1%'),
    position: 'relative',
    overflow: 'hidden',
  },
  // Style for the empty placeholder
  emptyPlaceholder: {
    backgroundColor: 'transparent', 
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inactiveCategory: {
    backgroundColor: '#F0F0F0',
  },
  inactiveCategoryText: {
    color: '#999',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('5%'),
  },
  inactiveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
  },
  categoryIcon: {
    marginBottom: hp('1%'),
  },
  categoryImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  categoryButtonText: {
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    textAlign: 'center',
    width: '90%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    width: wp('90%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#420F54',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90%'),
    padding: hp('3%'),
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#420F54',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    width: wp('90%'),
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default styles;