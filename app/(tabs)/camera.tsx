// Camera.tsx  ─────────────────────────────────────────────────────
import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  /* ----------------  permisos ---------------- */
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  /* ----------------  callbacks ---------------- */
  const toggleCameraFacing = () =>
    setFacing(cur => (cur === 'back' ? 'front' : 'back'));

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    const shot = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
      exif: false,
    });
    setPhoto(shot);
  };

  const handleRetakePhoto = () => setPhoto(null);

  /* ----------------  preview ---------------- */
  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
      />
    );

  /* ----------------  cámara ---------------- */
  return (
    <View style={styles.container}>
      {/* Cámara ocupa toda la pantalla */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        ref={cameraRef}
      />

      {/* Overlay con los botones */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.btn} onPress={toggleCameraFacing}>
          <AntDesign name="retweet" size={44} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleTakePhoto}>
          <AntDesign name="camera" size={44} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- estilos ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* overlay flotante */
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { textAlign: 'center', marginBottom: 12 },
});
