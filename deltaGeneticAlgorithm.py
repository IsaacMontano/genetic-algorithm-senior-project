import random
import csv
import sys

# constants
POPULATION_SIZE = 10
NUMBER_OF_GENES = 4

Genes = [[14,15,16,17,18],[7,8,9],[35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,
        53,54,55,56,57,58,59,60,61,62,63,64,65],[55,56,57,58,59,60,61,62,63,64,65]]

#body length
#wingspan
#outerWingLength
#keel

#create and randomize the population
current_population = [[] for i in range(POPULATION_SIZE)]

for i in range(POPULATION_SIZE):
    for j in range(NUMBER_OF_GENES):
        current_population[i].append(random.choice(Genes[j]))

#ask users for coeffients
target_speed = (sys.argv[1])
target_speed = float(target_speed)
target_endurance = (sys.argv[2])
target_endurance = float(target_endurance)
target_agility = (sys.argv[3])
target_agility = float(target_agility)

#calculate fitness score for each target
def get_speed_fitness_score(chromosome):
    targetEquation = ((-0.65417) + (0.03125 * chromosome[0]) + (0.2125 * chromosome[1]) + (0.00833 * chromosome[2]) + (-.005 * chromosome[3]))
    return targetEquation

def get_endurance_fitness_score(chromosome):
    targetEquation2 = ((0.558333333) + (0.13125 * chromosome[0]) + (0.0375 * chromosome[1]) + (0.008333 * chromosome[2]) + (0.0025 * chromosome[3]))
    return targetEquation2

def get_agility_fitness_score(chromosome):
    targetEquation3 = ((5.279166667) + (-0.10625*chromosome[0]) + (-0.0625 * chromosome[1]) + (-0.005833333* chromosome[2]) + (-0.005 * chromosome[3]))
    return targetEquation3

#calculate total fitness score using coefficients
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

f = open('deltaGeneticAlgorithm.csv', 'w')
writer = csv.writer(f)
writer.writerow(["body Length", "wingSpan", "Outer Wingspan", "keel"])
writer.writerow(current_population[sorted_scores[0][0]])

writer.writerow(["speed", "endurance", "agility"])
writer.writerow([get_speed_fitness_score(current_population[sorted_scores[0][0]]), get_endurance_fitness_score(current_population[sorted_scores[0][0]]), get_agility_fitness_score(current_population[sorted_scores[0][0]])])

writer.writerow(["target speed", "target endurance", "target agility"])
writer.writerow([target_speed, target_endurance, target_agility])
