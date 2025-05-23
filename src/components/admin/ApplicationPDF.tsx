import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Application } from '../../services/ApplicationService';

// Updated: Registration number moved to Personal Information section - NO header registration
// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2D3748',
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    border: '2px solid #2D3748',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 8,
    color: '#4A5568',
    marginBottom: 1,
  },
  photoContainer: {
    width: 70,
    height: 90,
    border: '1px solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 65,
    height: 85,
  },
  noPhoto: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  mainContent: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    padding: 3,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  field: {
    width: '50%',
    marginBottom: 3,
  },
  fieldFull: {
    width: '100%',
    marginBottom: 3,
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  value: {
    fontSize: 9,
    color: '#2D3748',
    marginTop: 1,
  },
  addressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addressField: {
    width: '50%',
    marginBottom: 4,
    paddingRight: 5,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1px solid #000',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    border: '2px solid #000',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkmark: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 1,
  },
  positionLabel: {
    fontSize: 8,
    marginRight: 10,
  },
  medicalBox: {
    border: '1px solid #000',
    padding: 5,
    minHeight: 25,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    marginTop: 15,
  },
});

interface ApplicationPDFProps {
  application: Application;
}

const ApplicationPDF: React.FC<ApplicationPDFProps> = ({ application }) => {
  const formatCategory = (category: string) => {
    switch (category) {
      case 'u-11': return 'Under-11';
      case 'u-13': return 'Under-13';
      case 'u-15': return 'Under-15';
      case 'u-17': return 'Under-17';
      case 'open': return 'Open';
      default: return category;
    }
  };

  // Helper function to render photo with better error handling
  const renderPhoto = () => {
    if (!application.image_url) {
      return <Text style={styles.noPhoto}>No Photo</Text>;
    }

    try {
      // Check if it's a valid URL and not a problematic domain
      const url = new URL(application.image_url);
      
      // Blogger/Google images often have CORS issues, show fallback
      if (url.hostname.includes('blogger.googleusercontent.com') || 
          url.hostname.includes('blogspot.com') ||
          url.hostname.includes('googleapis.com')) {
        return (
          <View>
            <Text style={styles.noPhoto}>Passport</Text>
            <Text style={styles.noPhoto}>Size</Text>
            <Text style={styles.noPhoto}>Photograph</Text>
          </View>
        );
      }

      // Try to render the image for other domains
      return <Image style={styles.photo} src={application.image_url} />;
    } catch (error) {
      return <Text style={styles.noPhoto}>Invalid Photo URL</Text>;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Clean Header - NO Registration Number */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>BAFCC</Text>
          </View>
          
          <View style={styles.headerText}>
            <Text style={styles.title}>BANDHGORA ANCHAL FOOTBALL COACHING CAMP</Text>
            <Text style={styles.subtitle}>Player Registration Form</Text>
            <Text style={styles.contactInfo}>BANDHGORA, JHARGRAM, 721514</Text>
            <Text style={styles.contactInfo}>bandhgoraanchalfcc2025@gmail.com</Text>
          </View>

          <View style={styles.photoContainer}>
            {renderPhoto()}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.leftColumn}>
            {/* Personal Information */}
            <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
            
            {/* Registration Number - MOVED HERE FROM HEADER */}
            <View style={styles.fieldFull}>
              <Text style={styles.label}>Registration Number:</Text>
              <Text style={[styles.value, { fontWeight: 'bold', fontSize: 10 }]}>{application.registration_number}</Text>
            </View>
            
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{application.name}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.value}>{formatCategory(application.category)}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Father's Name:</Text>
                <Text style={styles.value}>{application.father_name}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Mother's Name:</Text>
                <Text style={styles.value}>{application.mother_name}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Guardian:</Text>
                <Text style={styles.value}>{application.guardian_name || 'N/A'}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Date of Birth:</Text>
                <Text style={styles.value}>{application.dob}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.value}>{application.gender}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.value}>{application.age} years</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Height:</Text>
                <Text style={styles.value}>{application.height} cm</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{application.weight} kg</Text>
              </View>
            </View>

            <View style={styles.fieldFull}>
              <Text style={styles.label}>Aadhar Number:</Text>
              <Text style={styles.value}>{application.aadhar_number || 'N/A'}</Text>
            </View>

            {/* Contact Information */}
            <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
            
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Mobile:</Text>
                <Text style={styles.value}>{application.mobile_number}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Alternate Mobile:</Text>
                <Text style={styles.value}>{application.alternate_mobile_number || 'N/A'}</Text>
              </View>
            </View>

            {/* Permanent Address */}
            <Text style={[styles.label, { marginTop: 5, marginBottom: 3 }]}>Permanent Address:</Text>
            <View style={styles.addressGrid}>
              <View style={styles.addressField}>
                <Text style={styles.label}>Village:</Text>
                <Text style={styles.value}>{application.address.village}</Text>
              </View>
              <View style={styles.addressField}>
                <Text style={styles.label}>Post Office:</Text>
                <Text style={styles.value}>{application.address.post_office}</Text>
              </View>
              <View style={styles.addressField}>
                <Text style={styles.label}>Police Station:</Text>
                <Text style={styles.value}>{application.address.police_station}</Text>
              </View>
              <View style={styles.addressField}>
                <Text style={styles.label}>District:</Text>
                <Text style={styles.value}>{application.address.district}</Text>
              </View>
              <View style={styles.addressField}>
                <Text style={styles.label}>PIN:</Text>
                <Text style={styles.value}>{application.address.pin}</Text>
              </View>
            </View>

            {/* Current Address */}
            {application.current_address.village && (
              <>
                <Text style={[styles.label, { marginTop: 5, marginBottom: 3 }]}>Current Address:</Text>
                <View style={styles.addressGrid}>
                  <View style={styles.addressField}>
                    <Text style={styles.label}>Village:</Text>
                    <Text style={styles.value}>{application.current_address.village}</Text>
                  </View>
                  <View style={styles.addressField}>
                    <Text style={styles.label}>Post Office:</Text>
                    <Text style={styles.value}>{application.current_address.post_office}</Text>
                  </View>
                  <View style={styles.addressField}>
                    <Text style={styles.label}>Police Station:</Text>
                    <Text style={styles.value}>{application.current_address.police_station}</Text>
                  </View>
                  <View style={styles.addressField}>
                    <Text style={styles.label}>District:</Text>
                    <Text style={styles.value}>{application.current_address.district}</Text>
                  </View>
                  <View style={styles.addressField}>
                    <Text style={styles.label}>PIN:</Text>
                    <Text style={styles.value}>{application.current_address.pin}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.rightColumn}>
            {/* School Information */}
            <Text style={styles.sectionTitle}>SCHOOL INFO</Text>
            
            <View style={styles.fieldFull}>
              <Text style={styles.label}>School Name:</Text>
              <Text style={styles.value}>{application.school_name}</Text>
            </View>

            <View style={styles.fieldFull}>
              <Text style={styles.label}>Current Class:</Text>
              <Text style={styles.value}>{application.current_class}</Text>
            </View>

            {/* Playing Position */}
            <Text style={styles.sectionTitle}>PLAYING POSITION</Text>
            
            <View style={styles.fieldFull}>
              <Text style={styles.label}>Selected Position:</Text>
              <Text style={[styles.value, { fontWeight: 'bold', fontSize: 10 }]}>
                {application.playing_position.charAt(0).toUpperCase() + application.playing_position.slice(1)}
              </Text>
            </View>

            {/* Medical Issues */}
            <Text style={styles.sectionTitle}>MEDICAL ISSUES</Text>
            <View style={styles.medicalBox}>
              <Text style={{ fontSize: 8 }}>{application.medical_issues || 'None reported'}</Text>
            </View>

            {/* Submission Date */}
            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>SUBMISSION INFO</Text>
            <View style={styles.fieldFull}>
              <Text style={styles.label}>Submitted On:</Text>
              <Text style={styles.value}>
                {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer - Signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.label}>Applicant's Signature</Text>
            <View style={styles.signatureLine}></View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.label}>Guardian's Signature</Text>
            <View style={styles.signatureLine}></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ApplicationPDF; 