import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';
const fillerWords = [
  'um',
  'uh',
  'like',
  'you know',
  'well',
  'actually',
  'basically',
  'literally',
  'I mean',
  'sort of',
  'kind of',
  'right?',
  'okay',
  'so',
  'just',
  'really',
  'totally',
  'oh',
  'ah',
  'hmm',
  'hm',
  'ahem',
  'er',
  'ahh',
  'uhh',
  'huh',
];

const windowHeight = Dimensions.get('window').height;

const App = (): React.JSX.Element => {
  console.log(windowHeight);
  const [text, setText] = useState<string>('');
  const [fillerWordCount, setFillerWordCount] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log(e);

    const displayTest = e.value ? e.value.join(' ') : '';
    setText(displayTest);
    countFillerWords(displayTest);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const countFillerWords = (displayTest: string) => {
    // Implement your filler word counting logic here

    const words = displayTest.split(' ');
    const count = words.filter((word: string) =>
      fillerWords.includes(word.toLowerCase()),
    );
    setFillerWordCount(count.length);
  };

  const startListening = async () => {
    try {
      setText('');
      await Voice.start('en-US');

      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {text && (
        <ScrollView
          style={[styles.textViewContainer, {height: windowHeight * 0.6}]}>
          <View style={styles.viewTest}>
            {text.split(' ').map(word => (
              <Text
                style={[
                  styles.textView,
                  {
                    color: fillerWords.includes(word.toLowerCase())
                      ? 'red'
                      : 'white',
                  },
                ]}>
                {word}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}

      <Text style={[styles.textView, {paddingVertical: 10}]}>
        Filler Words Count: {fillerWordCount}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isListening ? 'red' : 'green'},
        ]}
        onPress={isListening ? stopListening : startListening}>
        <Text style={styles.buttonText}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },

  textViewContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    padding: 10,
    width: '100%',
    flexDirection: 'column',
  },

  viewTest: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },

  textView: {
    fontSize: 20,
    fontWeight: 'medium',
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
