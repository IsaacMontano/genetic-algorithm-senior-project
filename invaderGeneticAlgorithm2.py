import random
import csv
import sys

# constants
POPULATION_SIZE = 10
NUMBER_OF_GENES = 4

Genes = [[85,86,87,88,89,90,91,92,93,94,95],[10,11,12,13,14,15,16,17,18,19,20],[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
         [13,14,15,16,17]]

#1 frontAngle
#2 wingSpan
#3 keel
#4 bodylength

#randomize the population
current_population = [[] for i in range(POPULATION_SIZE)]

for i in range(POPULATION_SIZE):
    for j in range(NUMBER_OF_GENES):
        current_population[i].append(random.choice(Genes[j]))

#ask users for coefficients for each fitness score but coefficients must add up to 1
target_speed = (sys.argv[1])
target_speed = float(target_speed)
target_endurance = (sys.argv[2])
target_endurance = float(target_endurance)
target_agility = (sys.argv[3])
target_agility = float(target_agility)

#calculate the fitness score for each target
def get_speed_fitness_score(chromosome):
    targetEquation = (4.903125 + (-0.07625 * chromosome[0]) + (0.09625 * chromosome[1]) + (0.000833333 * chromosome[2]) + (0.234375 * chromosome[3]))
    return targetEquation

def get_endurance_fitness_score(chromosome):
    targetEquation1 = (7.609375 + (-0.07625 * chromosome[0]) + (0.09625 * chromosome[1]) + (-0.070833333 * chromosome[2]) + (0.190625 * chromosome[3]))
    return targetEquation1

def get_agility_fitness_score(chromosome):
    targetEquation2 = (17.334375 + (-0.08875 * chromosome[0]) + (-0.09875* chromosome[1]) + (-0.060833333 * chromosome[2]) + (-0.196875 * chromosome[3]))
    return targetEquation2

#calculate the total fitness score using the coefficients
def get_total_fitness_score(chromosome):
    speed = get_speed_fitness_score(chromosome)
    endurance = get_endurance_fitness_score(chromosome)
    agility = get_agility_fitness_score(chromosome)
    totalFitnessScore = (target_speed * speed) + (target_endurance * endurance) + (target_agility * agility)
    return totalFitnessScore

for i in range(10000):
    scores = [get_total_fitness_score(chromosome)
              for chromosome in current_population]
    sorted_scores = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)

    parent1 = current_population[sorted_scores[0][0]]
    parent2 = current_population[sorted_scores[1][0]]

    split_point = random.randint(1, NUMBER_OF_GENES - 1)
    children = []
    for i in range(POPULATION_SIZE - 2):
        child = parent1[:split_point] + parent2[split_point:]
        children.append(child)

    # mutate the children
    for i in range(POPULATION_SIZE - 2):
        for j in range(NUMBER_OF_GENES):
            if random.random() < 0.05:
                children[i][j] = random.choice(Genes[j])

    # add the children to the population
    current_population = [parent1, parent2] + children

# print the best score
print("Best score: ", sorted_scores[0][1])
print("Best chromosome: ", current_population[sorted_scores[0][0]])
print("Best speed score: ", get_speed_fitness_score(current_population[sorted_scores[0][0]]))
print("Best endurance score: ", get_endurance_fitness_score(current_population[sorted_scores[0][0]]))
print("Best agility score: ", get_agility_fitness_score(current_population[sorted_scores[0][0]]))

f = open('invaderGeneticAlgorithm.csv', 'w')
writer = csv.writer(f)
writer.writerow(["frontAngle", "wingSpan", "keel", "bodyLength"])
writer.writerow(current_population[sorted_scores[0][0]])

writer.writerow(["speed", "endurance", "agility"])
writer.writerow([get_speed_fitness_score(current_population[sorted_scores[0][0]]), get_endurance_fitness_score(current_population[sorted_scores[0][0]]), get_agility_fitness_score(current_population[sorted_scores[0][0]])])

writer.writerow(["target speed", "target endurance", "target agility"])
writer.writerow([target_speed, target_endurance, target_agility])
