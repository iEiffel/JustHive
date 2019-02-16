import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CATEGORY_SERVICE } from 'AppServices';
import { AuxText } from 'AppFonts';
import { WHITE, PRIMARY_TEXT } from 'AppColors';
import { getHexagonLayout, renderHexagonImages } from 'AppUtilities';
import {
  WINDOW_HEIGHT as height,
  HEXAGON_SIZE,
  HEXAGON_IMAGE_SIZE,
  HEXAGON_AVATARS
} from 'AppConstants';
import { styles, topicStateStyles } from '../styles';

const numberWords = ['one', 'two', 'three'];

export class Topics extends Component {
  static propTypes = {
    submitTopics: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    topics: PropTypes.array.isRequired
  };

  static defaultProps = {
    topics: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTopics: [],
      isButtonEnabled: true
    };
    this.hexagons = getHexagonLayout(3);
    this.selectTopic = ::this.selectTopic;
    this.isSelected = ::this.isSelected;
    this.renderTopics = ::this.renderTopics;
    this.renderLoading = ::this.renderLoading;
    this.renderNotFound = ::this.renderNotFound;
    this.renderHint = ::this.renderHint;
    this.submit = ::this.submit;
  }

  selectTopic(topicId) {
    const { selectedTopics } = this.state;

    if (this.isSelected(topicId)) {
      this.setState({
        selectedTopics: selectedTopics.filter(id => id !== topicId)
      });
    } else {
      this.setState({
        selectedTopics: [...selectedTopics, topicId]
      });
    }
  }

  submit() {
    const { selectedTopics } = this.state;
    this.setState({ isButtonEnabled: false });
    return this.props.submitTopics(selectedTopics);
  }

  isSelected(id) {
    const { selectedTopics } = this.state;
    return !!~selectedTopics.indexOf(id);
  }

  renderLoading() {
    return (
      <View style={ styles.loading }>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderNotFound() {
    return (
      <View style={ styles.notFound }>
        <Text style={ styles.whiteText }>
          Topics Not Found
        </Text>
      </View>
    );
  }

  renderHint() {
    const { selectedTopics, isButtonEnabled } = this.state;
    return (
      selectedTopics.length >= 3 ?
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => isButtonEnabled && this.submit()}
          style={styles.goldButton}
        >
          <AuxText upperCase={false} style={styles.primaryText}>Next</AuxText>
          <Icon
            name="keyboard-arrow-right"
            size={30}
            color={PRIMARY_TEXT}
            style={[styles.floatRight, { top: (height / 15 - 30) / 2, right: 5 }]}
          />
        </TouchableOpacity>
      :
        (!!selectedTopics.length &&
          <AuxText upperCase={false} style={styles.space}>
            Tap at least {numberWords[3 - selectedTopics.length - 1]} more to continue.
          </AuxText>
        )
    );
  }

  renderTopics() {
    const { topics } = this.props;
    let hexagonLayoutX = 0;
    let hexagonLayoutY = 0;
    const hexagonTopics = topics.map((topic, index) => {
      if (!this.hexagons[hexagonLayoutX][hexagonLayoutY]) {
        hexagonLayoutX++;
        hexagonLayoutY = 0;
      }
      const hexagonCenter = this.hexagons[hexagonLayoutX][hexagonLayoutY++].center;
      const hexagonAddons = this.isSelected(topic._id) ?
        topicStateStyles.selected :
        topicStateStyles.default;

      return {
        key: index,
        size: HEXAGON_SIZE,
        center: hexagonCenter,
        imageSource: { uri: topic.image },
        imageWidth: HEXAGON_IMAGE_SIZE,
        imageHeight: HEXAGON_IMAGE_SIZE,
        text: topic.name.toUpperCase(),
        onPress: () => this.selectTopic(topic._id),
        ...hexagonAddons
      };
    });
    return renderHexagonImages(hexagonTopics);
  }

  render() {
    const { topics, loading } = this.props;
    const yPosForLogoRow = this.hexagons[this.hexagons.length - 1][0].center.y;
    const dynamicHeight = {
      height: yPosForLogoRow + (3 * HEXAGON_IMAGE_SIZE) / 4
    };
    const dynamicWidth = {
      marginLeft: HEXAGON_IMAGE_SIZE / 3,
      width: this.hexagons[0].length * HEXAGON_IMAGE_SIZE
    };

    if (loading) {
      return this.renderLoading();
    }
    if (!loading && !topics.length) {
      return this.renderNotFound();
    }
    return (
      <View style={styles.container}>
        <View style={styles.space} />
        <AuxText upperCase={false} style={[styles.containerLabel, styles.space]}>
          Let’s get to know each other better!
        </AuxText>
        <AuxText upperCase={false}>
          To get started, <Text style={ styles.whiteNormal }>choose 3 or more topics</Text> that
        </AuxText>
        <AuxText upperCase={false} style={styles.space}>
          interest you. This can always be changed later.
        </AuxText>
        <View style={styles.space} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={[dynamicHeight, styles.topics]}
          contentContainerStyle={[styles.topicsContainer, dynamicWidth]}
        >
          <View style={[dynamicHeight, styles.topicsContainer, dynamicWidth]}>
            {this.renderTopics()}
          </View>
        </ScrollView>
        <View style={[styles.bottomContainer, styles.noPadding]}>
          {this.renderHint()}
        </View>
      </View>
    );
  }
}
