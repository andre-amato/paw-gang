/* eslint-disable react-native/sort-styles */
/* eslint-disable global-require */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-color-literals */
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/avatar-Luffy.png')} style={styles.image} />
      <Text style={styles.text}>User: testuser</Text>
      <Text style={styles.text}>Name: Eugenio</Text>
      <Text style={styles.text}>Dog Name: Luffy</Text>
      <Text style={styles.text}>Email: test@test.com</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#333',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  image: {
    borderColor: 'white',
    borderRadius: 100,
    borderWidth: 2,
    height: 200,
    width: 200,
    marginBottom: 20, 
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10, 
  },
  button: {
    backgroundColor: '#008CBA',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;