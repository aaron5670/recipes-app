import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RecipeDetailSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton colorMode="light" width={24} height={24} />
        <Skeleton colorMode="light" width={24} height={24} />
      </View>

      <View style={styles.content}>
        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          <Skeleton colorMode="light" width="100%" height={256} radius={16} />
        </View>

        {/* Recipe Title and Chef */}
        <View style={styles.titleContainer}>
          <Skeleton colorMode="light" width={200} height={36} />
          <Skeleton colorMode="light" width={150} height={24} />
        </View>

        {/* Recipe Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Skeleton colorMode="light" width={24} height={24} />
            <Skeleton colorMode="light" width={60} height={20} />
          </View>
          <View style={styles.statItem}>
            <Skeleton colorMode="light" width={24} height={24} />
            <Skeleton colorMode="light" width={60} height={20} />
          </View>
          <View style={styles.statItem}>
            <Skeleton colorMode="light" width={24} height={24} />
            <Skeleton colorMode="light" width={60} height={20} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Skeleton colorMode="light" width="100%" height={60} />
        </View>

        {/* Ingredients */}
        <View style={styles.sectionContainer}>
          <Skeleton colorMode="light" width={120} height={28} />
          <View style={styles.ingredientsList}>
            {[1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.ingredientItem}>
                <Skeleton colorMode="light" width="100%" height={48} radius={12} />
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.sectionContainer}>
          <Skeleton colorMode="light" width={120} height={28} />
          {[1, 2, 3].map((index) => (
            <View key={index} style={styles.instructionItem}>
              <Skeleton colorMode="light" width={24} height={24} />
              <Skeleton colorMode="light" width="80%" height={24} />
            </View>
          ))}
        </View>

        {/* Difficulty Info */}
        <View style={styles.difficultyContainer}>
          <Skeleton colorMode="light" width="100%" height={64} radius={12} />
        </View>
      </View>

      {/* Cook Button */}
      <View style={styles.buttonContainer}>
        <Skeleton colorMode="light" width="100%" height={56} radius={12} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    marginBottom: 24,
  },
  titleContainer: {
    gap: 8,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  ingredientsList: {
    gap: 12,
    marginTop: 16,
  },
  ingredientItem: {
    marginBottom: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  difficultyContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    padding: 16,
  },
});
