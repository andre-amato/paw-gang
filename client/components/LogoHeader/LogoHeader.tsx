import styles from "./LogoHeaderStyles";
import {Image, View} from 'react-native';


function LogoHeader () {
  return (
    <View style={styles.logoDiv}>
      <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
    </View>
  );
}

export default LogoHeader
