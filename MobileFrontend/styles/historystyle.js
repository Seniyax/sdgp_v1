import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
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
  userIdText: {
    position: 'absolute',
    bottom: -hp('2%'),
    right: wp('5%'),
    fontSize: wp('2.5%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  activeTabItem: {
    backgroundColor: '#420F54',
  },
  tabText: {
    fontSize: wp('3.5%'),
    color: '#420F54',
    fontFamily: 'Poppins-Medium',
  },
  activeTabText: {
    color: '#ffffff',
  },
  countBadge: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Regular',
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  reservationItem: {
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  venueName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#272D2F',
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
    fontFamily: 'Poppins-Medium',
  },
  reservationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('1%'),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('4%'),
    marginBottom: hp('1%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
    fontFamily: 'Poppins-Regular',
  },
  reservationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  totalAmount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
  },
  viewDetailsText: {
    fontSize: wp('3.5%'),
    color: '#420F54',
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp('90%'),
    maxHeight: hp('80%'),
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    zIndex: 1,
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#420F54',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  venueImage: {
    width: wp('80%'),
    height: hp('20%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
  },
  placeholderImage: {
    width: wp('80%'),
    height: hp('20%'),
    borderRadius: wp('3%'),
    backgroundColor: '#F3E4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalDetailsContainer: {
    width: '100%',
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  modalDetailLabel: {
    fontSize: wp('3%'),
    color: '#666',
    marginLeft: wp('2%'),
    fontFamily: 'Poppins-Regular',
  },
  modalDetailValue: {
    fontSize: wp('3.5%'),
    color: '#272D2F',
    fontWeight: 'bold',
    marginLeft: wp('2%'),
    fontFamily: 'Poppins-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
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
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: hp('1%'),
    fontSize: wp('3%'),
    color: '#999',
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
    marginTop: hp('2%'),
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});

export default styles;