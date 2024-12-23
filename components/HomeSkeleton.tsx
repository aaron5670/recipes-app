import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Skeleton colorMode="light" width={200} height={32} />
        <Skeleton colorMode="light" width={150} height={24} />
      </View>

      <View style={styles.searchContainer}>
        <Skeleton colorMode="light" width="100%" height={40} />
      </View>

      <View style={styles.categoriesContainer}>
        <Skeleton colorMode="light" width={75} height={75} radius="square" />
        <Skeleton colorMode="light" width={75} height={75} radius="square" />
        <Skeleton colorMode="light" width={75} height={75} radius="square" />
        <Skeleton colorMode="light" width={75} height={75} radius="square" />
      </View>

      <View style={styles.recipesContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View key={index} style={styles.recipeCard}>
            <Skeleton colorMode="light" width={120} height={120} />
            <View style={styles.recipeDetails}>
              <Skeleton colorMode="light" width={150} height={18} />
              <Skeleton colorMode="light" width={100} height={16} />
              <View style={styles.recipeStats}>
                <Skeleton colorMode="light" width={60} height={16} />
                <Skeleton colorMode="light" width={60} height={16} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  headerContainer: {
    gap: 16,
    marginVertical: 16,
  },
  searchContainer: {
    marginVertical: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  recipesContainer: {
    flex: 1,
    marginVertical: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeDetails: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  recipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
