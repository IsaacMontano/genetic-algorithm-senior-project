This project was my Senior Project/Thesis for the Bradley University Computer Science Program. I have included what could be worked on in the future in the repo. 
The python portion, data collecting, drone designs was done by myself. The javascript portion was completed by Ryan Miller. Our project was overseen by Dr. Anthony Grichnik.

Microdrone Optimization utilizing a Genetic Algorithm with a linear regression model

Motivation and Methodology
---------------------------------
In response to crucial requirements in agriculture, forestry, emergency services, and various other significant fields, the advancement of drone
technologies is rapidly progressing. In order to fulfill individual goals and requirements, new methods need to be created in order to find the best fit
for a unique problem. Therefore, optimizing drones to specialize in certain qualities is a real problem that must be solved for the modern day.
Different designs can be utilized to their fullest potential in order to cut down on costs and material. There are several factors that impact a drone’s
performance, but is there a way to predict how a drone may perform in areas such as speed, agility, and endurance? By using a linear regression model with a 
genetic algorithm, we can predict a drone’s performance before it is built.

A genetic algorithm (GA) uses a table of random solutions called chromosomes, each scored based on a user-defined goal function, with the
weakest removed and the two highest used as the basis for the next generation. New chromosomes, called Child Chromosomes, are created by
combining elements from the parent chromosomes at a pivot point. This process is repeated until the goal function is met.

Linear regression models were used to simplify how different aspects of a drone affect its performance. Different designs were tested throughout
several weeks with different variables of their designs being changed to take note of how a variable can impact the drone’s performance. These
variables included the front angle, drone length, drone wingspan, drone keel length, etc. Drones were tested for their velocity (speed), how quick
there were able to complete 3 loops in the air (agility), and the drone’s glide distance after the propellors were shut off (endurance).


Website Creation
-------------------------------
To promote user interaction, a desktop application was created as a flexible and portable user interface. A server was created upon the
WinSock 2 API capable of dealing with simple HTTP requests as well as running code from other parts of the project. A JavaScript based
website was built integrating WebGL 2 to render a 3d model of each plane. The website can manage most of its own functionality within
the client's browser and only requires the server to handle the more intensive running of the genetic algorithm.


Combining a Linear Regression Model with the Genetic Algorithm
----------------------------------------------------------------
After collecting various amounts of data from the plane models tested with changes to their structures, a linear regression model was created 
to quantify how much each individual variable affected a target goal. From here, we can create an equation to predict future outcomes for
targeted goals. Using these equations, we have a basis for our scoring method for the genetic algorithm.

We have code in each individual model that shows the calculated variables for each Model being used to calculate predicted values for each goal we 
tested for in our experiments. It is appropriate that the fitness score calculated is a result of the equation provided by the linear regression model 
as the user will be able to decide the weights of each target goal.This method will allow for a graded or rank approach for the drone, rather than a specific
number that may be misleading to the user.


Results
------------------------------
The program prints to the user the following measurements for the requirements that the user requires. For this example, the program was asked 
to maximize all goal objectives for the Hammerhead model, which is returned to the user at the end of the program. Running our Genetic Algorithm 
multiple times shows demonstrates the Algorithm’s accuracy as each rerun produces the same drone measurements. With Website functionality,
a user can choose sliders to decide what weights each tested variable is given and the website returns the measurements in a more elegant fashion.


Conclusion
-------------------------------
Using Genetic Algorithms to predict outcomes of a drone’s performance is an effective way to personalize drones for a user’s individual needs. This
project is the first steppingstone in optimizing larger, more commercially used drones and will help in reducing materials used and cost to produce
each individual drone. As a result, drone technology can be used in a wider range of fields and more accessible to individuals who need them.
Moving forward, this project could be further optimized in a few ways. One main issue is that the linear regression models best describe a drone’s
performance without accounting for variables such as wind resistance or direction. Correcting this may lead to more precise results in a real-world
setting. Additionally, creating the drones from different materials could have additional impacts in changing flight pattern not yet foreseen. Finally,
human error could have skewed the results of the drone in unpredictable ways. Having consistent launch techniques, more precise folding/building
methodologies, or a constant flight pattern will greatly impact the drone’s performance as well.
