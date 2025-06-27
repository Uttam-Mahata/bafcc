import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Application } from '../../services/ApplicationService';

// Enhanced styles with better colors and layout
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
    marginBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1e40af',
    paddingBottom: 10,
    backgroundColor: '#eff6ff',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: '#fbbf24',
    borderRightColor: '#fbbf24',
    borderTopColor: '#fbbf24',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  logoFallback: {
    width: 60,
    height: 60,
    marginRight: 15,
    border: '3px solid #1e40af',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    color: '#059669',
    marginBottom: 1,
    fontWeight: 'bold',
  },
  photoContainer: {
    width: 70,
    height: 90,
    border: '3px solid #1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: 64,
    height: 84,
    borderRadius: 4,
  },
  noPhoto: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    // Allow text to take up more space if needed and wrap
    flexShrink: 1,
    paddingHorizontal: 2, // Add some horizontal padding
  },
  mainContent: {
    flexDirection: 'row',
    backgroundColor: '#fefefe',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#fbbf24',
    borderRightColor: '#fbbf24',
    borderBottomColor: '#1e40af',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 5,
    borderLeftWidth: 2,
    borderLeftColor: '#0ea5e9',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    padding: 8,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    color: '#ffffff',
    backgroundColor: '#1e40af',
    borderRadius: 6,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  registrationHighlight: {
    backgroundColor: '#dbeafe',
    border: '2px solid #1e40af',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  registrationNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    letterSpacing: 1,
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
    color: '#374151',
    marginBottom: 1,
  },
  value: {
    fontSize: 9,
    color: '#111827',
    marginTop: 2,
    backgroundColor: '#f9fafb',
    padding: 2,
    borderRadius: 2,
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
    border: '1px solid #dc2626',
    padding: 5,
    minHeight: 25,
    marginTop: 5,
    backgroundColor: '#fef2f2',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#1e40af',
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 5,
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 5,
    border: '1px solid #d1d5db',
  },
  signatureLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    width: '100%',
    marginTop: 15,
  },
});

interface ApplicationPDFProps {
  application: Application;
  images: {
    photo: string | null;
  };
}

const ApplicationPDF: React.FC<ApplicationPDFProps> = ({ application, images }) => {
  const formatCategory = (category: string) => {
    switch (category) {
      case 'u-11': return 'Under-11 Boys';
      case 'u-13': return 'Under-13 Boys';
      case 'u-15': return 'Under-15 Boys';
      case 'u-17': return 'Under-17 Boys';
      case 'open': return 'Open Boys';
      case 'gu-11': return 'Under-11 Girls';
      case 'gu-13': return 'Under-13 Girls';
      case 'gu-15': return 'Under-15 Girls';
      case 'gu-17': return 'Under-17 Girls';
      case 'gopen': return 'Open Girls';
      default: return category;
    }
  };

  // Enhanced photo rendering with processed images
  const renderPhoto = () => {
    if (images.photo) {
      return <Image style={styles.photo} src={images.photo} />;
    }
    return <Text style={styles.noPhoto}>No Photo Available</Text>;
  };

  // Enhanced logo rendering with static path
  const renderLogo = () => {
    return <Image style={styles.logo} src="/bafcc-logo.png" />;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          {renderLogo()}
          
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

        {/* Registration Number Highlight */}
        <View style={styles.registrationHighlight}>
          <Text style={styles.registrationNumber}>
            Registration Number: {application.registration_number}
          </Text>
        </View>

        {/* Main Content with enhanced styling */}
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

        {/* Enhanced Footer */}
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