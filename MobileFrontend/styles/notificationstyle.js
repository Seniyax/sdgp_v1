import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('5%'),
    paddingBottom: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  screenTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
    flex: 1,
    marginLeft: wp('3%'),
  },
  markAllReadButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  markAllReadText: {
    color: '#420F54',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  totalCount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#272D2F',
    fontFamily: 'Poppins-Bold',
  },
  unreadCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
  },
  countLabel: {
    fontSize: wp('4%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  animatedContainer: {
    marginBottom: hp('1.5%'),
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#F3E4FF',
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  notificationTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#272D2F',
    flex: 1,
    fontFamily: 'Poppins-Bold',
  },
  timeStamp: {
    fontSize: wp('3%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  notificationMessage: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  unreadIndicator: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#420F54',
    position: 'absolute',
    top: hp('0.5%'),
    right: 0,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('10%'),
  },
  emptyStateText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#272D2F',
    marginTop: hp('2%'),
    fontFamily: 'Poppins-Bold',
  },
  emptyStateSubText: {
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'center',
    marginTop: hp('1%'),
    marginHorizontal: wp('10%'),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('10%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#420F54',
    fontFamily: 'Poppins-Regular',
  },
});

export default styles;