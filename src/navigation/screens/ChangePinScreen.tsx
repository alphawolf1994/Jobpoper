import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { changePin, clearError } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const ChangePinScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const authState = useSelector((state: RootState) => state?.auth);
    const loading = authState?.loading || false;
    const error = authState?.error || null;
    const { showAlert, AlertComponent: alertModal } = useAlertModal();

    const [newPin, setNewPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [step, setStep] = useState(1); // 1 = new PIN, 2 = confirm new PIN

    const newPinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
    const confirmPinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

    const showErrorAlert = (message: string) =>
        showAlert({
            title: "Error",
            message,
            type: "error",
        });

    const showSuccessAlert = (message: string, onConfirm: () => void) =>
        showAlert({
            title: "Success",
            message,
            type: "success",
            buttons: [
                {
                    label: "OK",
                    onPress: onConfirm,
                },
            ],
        });

    const handlePinChange = (value: string, index: number, pinType: 'new' | 'confirm') => {
        if (value.length > 1) return; // Prevent multiple characters

        // Clear error when user starts typing
        if (error) {
            dispatch(clearError());
        }

        let pinArray: string[];
        let setPinArray: React.Dispatch<React.SetStateAction<string[]>>;
        let refs: React.MutableRefObject<(TextInput | null)[]>;

        if (pinType === 'new') {
            pinArray = [...newPin];
            setPinArray = setNewPin;
            refs = newPinInputRefs;
        } else {
            pinArray = [...confirmPin];
            setPinArray = setConfirmPin;
            refs = confirmPinInputRefs;
        }

        pinArray[index] = value;
        setPinArray(pinArray);

        // Auto-focus next input
        if (value && index < 3) {
            refs.current[index + 1]?.focus();
        } else if (value && index === 3) {
            // All 4 digits entered, auto-advance or submit
            setTimeout(() => {
                if (pinType === 'new' && pinArray.join('').length === 4) {
                    setStep(2);
                    confirmPinInputRefs.current[0]?.focus();
                } else if (pinType === 'confirm' && pinArray.join('').length === 4) {
                    handleSubmit(pinArray);
                }
            }, 100);
        }
    };

    const handleKeyPress = (key: string, index: number, pinType: 'new' | 'confirm') => {
        const refs = pinType === 'new' ? newPinInputRefs : confirmPinInputRefs;
        const pinArray = pinType === 'new' ? newPin : confirmPin;

        if (key === 'Backspace' && !pinArray[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (updatedConfirmPin?: string[]) => {
        const currentConfirmPin = updatedConfirmPin || confirmPin;
        const newPinString = newPin.join('');
        const confirmPinString = currentConfirmPin.join('');

        // Validation
        if (newPinString.length !== 4) {
            showErrorAlert('Please enter your new 4-digit PIN.');
            return;
        }

        if (confirmPinString.length !== 4) {
            showErrorAlert('Please confirm your new 4-digit PIN.');
            return;
        }

        if (newPinString !== confirmPinString) {
            showErrorAlert('PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '']);
            confirmPinInputRefs.current[0]?.focus();
            return;
        }

        try {
            const result = await dispatch(changePin(newPinString)).unwrap();

            if (result.status === 'success') {
                showSuccessAlert(
                    result.message || 'PIN changed successfully!',
                    () => navigation.goBack()
                );
            }
        } catch (error: any) {
            showErrorAlert(error || 'Failed to change PIN. Please try again.');
            // Reset to new PIN step on error
            setNewPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            setStep(1);
            newPinInputRefs.current[0]?.focus();
        }
    };

    const handleBack = () => {
        if (step === 1) {
            navigation.goBack();
        } else if (step === 2) {
            setStep(1);
            setConfirmPin(['', '', '', '']);
        }
    };

    const renderPinInputs = (
        pinArray: string[],
        refs: React.MutableRefObject<(TextInput | null)[]>,
        pinType: 'new' | 'confirm'
    ) => {
        return pinArray.map((digit, index) => (
            <TextInput
                key={index}
                ref={(ref) => {
                    if (ref) {
                        refs.current[index] = ref;
                    }
                }}
                style={[
                    styles.pinInput,
                    digit ? styles.pinInputFilled : styles.pinInputEmpty
                ]}
                value={digit}
                onChangeText={(value) => handlePinChange(value, index, pinType)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index, pinType)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                secureTextEntry
            />
        ));
    };

    const getStepInfo = () => {
        switch (step) {
            case 1:
                return {
                    emoji: '🔐',
                    title: 'Enter New PIN',
                    subtitle: 'Create a new 4-digit PIN for your account'
                };
            case 2:
                return {
                    emoji: '✅',
                    title: 'Confirm New PIN',
                    subtitle: 'Please confirm your new 4-digit PIN'
                };
            default:
                return {
                    emoji: '🔐',
                    title: 'Enter New PIN',
                    subtitle: 'Create a new 4-digit PIN for your account'
                };
        }
    };

    const stepInfo = getStepInfo();
    const currentPin = step === 1 ? newPin : confirmPin;
    const currentRefs = step === 1 ? newPinInputRefs : confirmPinInputRefs;
    const currentPinType = step === 1 ? 'new' : 'confirm';

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                        <AntDesign
                            name="arrow-left"
                            size={24}
                            style={{
                                marginRight: 10,
                                marginTop: 2,
                            }}
                            color={Colors.black}
                        />
                    </TouchableOpacity>

                    <View style={styles.logoWrap}>
                        <Text style={styles.emoji}>{stepInfo.emoji}</Text>
                        <Text style={styles.title}>{stepInfo.title}</Text>
                        <Text style={styles.subtitle}>{stepInfo.subtitle}</Text>
                    </View>

                    <View style={styles.pinSection}>
                        <View style={styles.pinContainer}>
                            {renderPinInputs(currentPin, currentRefs, currentPinType)}
                        </View>

                        {step === 1 && (
                            <Button
                                label="Continue"
                                onPress={() => {
                                    if (currentPin.join('').length === 4) {
                                        setStep(2);
                                        confirmPinInputRefs.current[0]?.focus();
                                    }
                                }}
                                style={{
                                    ...styles.continueButton,
                                    backgroundColor: currentPin.join('').length === 4 ? Colors.primary : Colors.gray,
                                    opacity: currentPin.join('').length === 4 ? 1 : 0.6
                                }}
                                disabled={currentPin.join('').length !== 4}
                            />
                        )}

                        {step === 2 && (
                            <Button
                                label={loading ? "Changing PIN..." : "Change PIN"}
                                onPress={() => handleSubmit()}
                                style={{
                                    ...styles.submitButton,
                                    backgroundColor: confirmPin.join('').length === 4 ? Colors.primary : Colors.gray,
                                    opacity: confirmPin.join('').length === 4 ? 1 : 0.6
                                }}
                                disabled={loading || confirmPin.join('').length !== 4}
                            />
                        )}
                    </View>
                </ScrollView>
                <Loader visible={loading} message="Changing your PIN..." />
                {alertModal}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    content: {
        padding: 20,
        paddingTop: 12,
        flex: 1,
        justifyContent: 'center'
    },
    backBtn: {
        position: 'absolute',
        left: 16,
        top: 12,
        zIndex: 1
    },
    logoWrap: {
        alignItems: "center",
        // marginBottom: 50
    },
    emoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 8,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20
    },
    pinSection: {
        marginTop: 10,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 40,
        paddingHorizontal: 20,
    },
    pinInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    pinInputEmpty: {
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    pinInputFilled: {
        borderColor: Colors.primary,
        backgroundColor: Colors.lightBlue || '#F0F8FF',
    },
    continueButton: {
        marginTop: 40,
        borderRadius: 12,
    },
    submitButton: {
        marginTop: 40,
        borderRadius: 12,
    },
});

export default ChangePinScreen;
