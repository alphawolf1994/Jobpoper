import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Colors, widthToDp, heightToDp } from '../utils';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconType: 'feather' | 'material' | 'ant';
  completed: boolean;
  action: string;
  screen?: string;
}

interface ParentOnboardingGuideProps {
  onComplete: () => void;
}

const ParentOnboardingGuide = ({ onComplete }: ParentOnboardingGuideProps) => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  // Local state for onboarding steps
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: 'Complete Your Profile',
      description: 'Add your personal information, contact details, and profile picture to get started.',
      icon: 'user',
      iconType: 'feather',
      completed: false,
      action: 'Complete Profile',
      screen: 'MainProfileScreen',
    },
    {
      id: 2,
      title: 'Add Your Child\'s Profile',
      description: 'Create profiles for your children with their basic information and academic details.',
      icon: 'child-care',
      iconType: 'material',
      completed: false,
      action: 'Add Child',
      screen: 'ChildrenScreen',
    },
    {
      id: 3,
      title: 'Enroll in School',
      description: 'Browse and select the best school for your child and complete the enrollment process.',
      icon: 'book',
      iconType: 'feather',
      completed: false,
      action: 'Find Schools',
      screen: 'SchoolsScreen',
    },
  ]);

  const handleStepAction = (step: OnboardingStep) => {
    // Mark current step as completed
    const updatedSteps = onboardingSteps.map(s => 
      s.id === step.id ? { ...s, completed: true } : s
    );
    setOnboardingSteps(updatedSteps);
    
    if (step.screen) {
      try {
        (navigation as any).navigate(step.screen);
      } catch (error) {
        console.log(`Navigation to ${step.screen} failed:`, error);
      }
    }
  };

  const handleNext = () => {
    const currentStepData = onboardingSteps[currentStep];
    
    // Check if current step is completed
    if (!currentStepData.completed) {
      // If current step is not completed, complete it first
      handleStepAction(currentStepData);
    }
    
    // Move to next step or complete onboarding
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed, show dashboard
      onComplete();
    }
  };

  const handleSkip = () => {
    // Skip to dashboard
    onComplete();
  };

  const getProgressPercentage = () => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    return (completedSteps / onboardingSteps.length) * 100;
  };

  const renderStepIcon = (step: OnboardingStep, index: number) => {
    const isCompleted = step.completed;
    const isCurrent = index === currentStep;
    const isUpcoming = index > currentStep;

    const iconProps = {
      size: 24,
      color: isCompleted ? Colors.white : isCurrent ? Colors.primary : Colors.gray,
    };

    let IconComponent;
    switch (step.iconType) {
      case 'feather':
        IconComponent = Feather;
        break;
      case 'material':
        IconComponent = MaterialIcons;
        break;
      case 'ant':
        IconComponent = AntDesign;
        break;
      default:
        IconComponent = Feather;
    }

    return (
      <View style={[
        styles.stepIconContainer,
        isCompleted && styles.stepIconCompleted,
        isCurrent && styles.stepIconCurrent,
        isUpcoming && styles.stepIconUpcoming,
      ]}>
        {isCompleted ? (
          <Feather name="check" size={20} color={Colors.white} />
        ) : (
          <IconComponent name={step.icon as any} {...iconProps} />
        )}
      </View>
    );
  };

  const renderStepCard = (step: OnboardingStep, index: number) => {
    const isCompleted = step.completed;
    const isCurrent = index === currentStep;

    return (
      <TouchableOpacity
        key={step.id}
        style={[
          styles.stepCard,
          isCompleted && styles.stepCardCompleted,
          isCurrent && styles.stepCardCurrent,
        ]}
        onPress={() => handleStepAction(step)}
        activeOpacity={0.8}
      >
        <View style={styles.stepCardHeader}>
          {renderStepIcon(step, index)}
          <View style={styles.stepCardContent}>
            <Text style={[
              styles.stepTitle,
              isCompleted && styles.stepTitleCompleted,
              isCurrent && styles.stepTitleCurrent,
            ]}>
              {step.title}
            </Text>
            <Text style={[
              styles.stepDescription,
              isCompleted && styles.stepDescriptionCompleted,
            ]}>
              {step.description}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            isCompleted && styles.actionButtonCompleted,
            isCurrent && styles.actionButtonCurrent,
          ]}
          onPress={() => handleStepAction(step)}
        >
          <Text style={[
            styles.actionButtonText,
            isCompleted && styles.actionButtonTextCompleted,
            isCurrent && styles.actionButtonTextCurrent,
          ]}>
            {isCompleted ? 'Completed' : step.action}
          </Text>
          {!isCompleted && (
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Shly!</Text>
          <Text style={styles.welcomeSubtitle}>
            Let's get you started with a few simple steps
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {onboardingSteps.filter(step => step.completed).length} of {onboardingSteps.length} completed
          </Text>
        </View>
      </View>

      {/* Current Step */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepsContent}>
          {renderStepCard(onboardingSteps[currentStep], currentStep)}
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 
                 onboardingSteps[currentStep].completed ? 'Next' : 'Next'}
              </Text>
              <Feather name="arrow-right" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          {/* Help Section */}
          {/* <View style={styles.helpSection}>
            <View style={styles.helpCard}>
              <Feather name="help-circle" size={24} color={Colors.primary} />
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  Our support team is here to assist you with any questions.
                </Text>
                <TouchableOpacity style={styles.helpButton}>
                  <Text style={styles.helpButtonText}>Contact Support</Text>
                  <Feather name="external-link" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: Colors.lightGray,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  stepsContainer: {
    flex: 1,
  },
  stepsContent: {
    padding: 20,
  },
  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCardCompleted: {
    borderColor: Colors.green,
    backgroundColor: '#f8fff8',
  },
  stepCardCurrent: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f8ff',
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepIconCompleted: {
    backgroundColor: Colors.green,
  },
  stepIconCurrent: {
    backgroundColor: Colors.primary,
  },
  stepIconUpcoming: {
    backgroundColor: Colors.lightGray,
  },
  stepCardContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 6,
  },
  stepTitleCompleted: {
    color: Colors.green,
  },
  stepTitleCurrent: {
    color: Colors.primary,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  stepDescriptionCompleted: {
    color: Colors.gray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  actionButtonCompleted: {
    backgroundColor: Colors.green,
  },
  actionButtonCurrent: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  actionButtonTextCompleted: {
    color: Colors.white,
  },
  actionButtonTextCurrent: {
    color: Colors.white,
  },
  helpSection: {
    marginTop: 20,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
  },
  helpContent: {
    flex: 1,
    marginLeft: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 6,
  },
  helpDescription: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 6,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginRight: 8,
  },
});

export default ParentOnboardingGuide;
