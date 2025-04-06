import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('5%'),
    paddingBottom: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#420F54',
    marginLeft: wp('3%'),
    fontFamily: 'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('6%'),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    color: '#272D2F',
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  horizontalRestaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    height: hp('15%'),
  },
  horizontalRestaurantImage: {
    width: wp('30%'),
    height: '100%',
    backgroundColor: "white",
  },
  horizontalRestaurantInfo: {
    flex: 1,
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  nameAndRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#272D2F',
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#272D2F',
    marginLeft: wp('1%'),
    fontFamily: 'Poppins-Medium',
  },
  cuisineText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginVertical: hp('0.5%'),
    fontFamily: 'Poppins-Regular',
  },
  waitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitTimeText: {
    fontSize: wp('3.5%'),
    color: '#272D2F',
    marginLeft: wp('1%'),
    fontFamily: 'Poppins-Regular',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('3%'),
  },
  statusDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    color: '#272D2F',
    fontFamily: 'Poppins-Regular',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#420F54',
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('50%'),
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    margin: wp('5%'),
    padding: hp('3%'),
    backgroundColor: '#FFF8F8',
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#D32F2F',
    marginBottom: hp('2%'),
    textAlign: 'center',
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp('2%'),
  },
  footerText: {
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
    color: '#420F54',
    fontFamily: 'Poppins-Regular',
  },
});

export default styles;