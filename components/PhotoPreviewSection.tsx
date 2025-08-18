// app/components/PhotoPreviewSection.tsx
import { Fontisto, AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { CameraCapturedPicture } from 'expo-camera';

type Props = {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
};

const BACKEND = 'http://192.168.3.3:8000';         // 🔄  localhost en Android-emulador
// iOS simulador → http://127.0.0.1:8000  |  dispositivo real → IP de tu PC

export default function PhotoPreviewSection({
  photo,
  handleRetakePhoto,
}: Props) {
  const [sending, setSending] = useState(false);

  /* ------------------------------------------------------- */
  /* 📨  Enviar la imagen al backend FastAPI                  */
  /* ------------------------------------------------------- */
  const handleSendPhoto = async () => {
    try {
      setSending(true);

      // 1. Leemos el archivo como binario (Buffer) desde su URI temporal
      const fileData = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Creamos un FormData → "file" es el nombre del parámetro
      const form = new FormData();
      form.append('file', {
        uri: photo.uri,
        name: 'capture.jpg',
        type: 'image/jpeg',
      } as any);

      // 3. Llamamos a /upload
      const res = await fetch(`${BACKEND}/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // NOTE: *NO* pongas 'Content-Type' con FormData   (RN lo añade solo)
        },
        body: form,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();         // { job_id: '...' }
      Alert.alert('✅ Enviado', `job_id: ${data.job_id}`);

      /* TODO:
         - Navega a una pantalla "Status" y pásale el job_id
         - Limpia la foto o vuelve a la cámara
      */
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message ?? 'Fallo al subir la imagen');
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image
          style={styles.preview}
          source={{ uri: photo.uri }}
          resizeMode="contain"
        />
      </View>

      {/* Botonera */}
      <View style={styles.buttonRow}>
        {/* Repetir */}
        <TouchableOpacity style={styles.circleBtn} onPress={handleRetakePhoto}>
          <Fontisto name="trash" size={34} color="#fff" />
        </TouchableOpacity>

        {/* Enviar */}
        <TouchableOpacity
         style={[styles.circleBtn, { backgroundColor: '#2e7d32' }]}
         onPress={handleSendPhoto}
         disabled={sending}
        >
         {sending ? (
          <ActivityIndicator color="#fff" />
         ) : (
           <AntDesign name="clouduploado" size={34} color="#fff" />
      )}
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ------------------- estilos ------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
  },
  circleBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'crimson',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
