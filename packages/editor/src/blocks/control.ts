import * as Blockly from 'blockly/core'

const CONTROL_COLOR = 30
const CONTROL_HAT_COLOR = 45

/*
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡁⠄⠄⠄⠄⠄⠄⠄⠉⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢳⣿⣿⣶⣶⣶⠄⠄⠄⠠⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢧⡼⢤⣽⣛⣟⢋⢀⠄⠄⠸⡄⡍⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣼⣆⣰⠈⣉⡛⠉⠡⠄⠄⠄⢸⡃⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡷⣿⣧⠄⠄⠄⠄⠄⠈⣗⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⢣⣎⡻⠏⠄⠄⠄⠄⠄⠄⡟⣷⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡟⠈⠈⡉⠄⠁⡠⠄⠄⠄⠄⠇⠘⡆⠄⠈⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠄⠄⣿⣇⠄⠂⠈⠉⠉⠄⠄⠄⠄⠄⠄⠄⢱⠄⠄⠄⠐⣻⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠉⠄⠄⠄⣿⣿⣆⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠂⠄⠄⠄⠄⠈⠙⢫⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠄⠄⠄⠄⠄⠄⢀⣿⣿⣿⣷⣶⣦⣤⣀⣀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠻⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣏⣓⣀⠄⠄⠄⠄⠄⠄⣀⣺⣯⣭⣿⣿⣿⣿⣿⡿⣿⣻⣯⣿⣶⣦⣤⣀⠄⠄⠄⠄⠄⠄⠄⠄⠈⠙⠻⠽⢻⢿⡿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⢭⣾⣿⣿⣿⣿⠇⠄⣠⠄⠄⠄⠘⣿⣿⣿⣿⣿⡿⣻⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡆⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠑⢿⣿⣿⣿⣿             Kingmang
⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⠿⣋⣠⣴⣿⣇⠄⠄⠄⠹⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣠⣤⣄⣀⠑⢿⣿⣿
⣿⣿⣿⡟⣽⣿⣿⣿⢟⣡⣶⣿⣿⣿⣿⣿⣿⣆⠄⠄⠄⠘⢿⡟⢹⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠄⠄⠄⠄⡀⠄⠄⢠⣻⣿⡿⠋⣷⣗⡀⢻⣿
⣿⣿⣿⣾⣿⣿⣿⣣⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠄⠄⠄⠄⠄⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢆⠄⠄⠄⠄⠄⠄⣧⣿⣿⣯⣶⣿⣿⠇⢸⣿
⣿⣿⣿⠿⣿⣿⢷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠄⠄⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡌⠃⠄⠄⠄⠄⠄⠈⠫⢏⣾⣟⡿⠋⠄⠴⢮
⣿⡿⠋⠄⠈⠋⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠄⠄⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⡟⠄⠄⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⣄⠄⠄⠄⠄⠄⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠘⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣦⣀⠄⠄⠄⠄⠄⠈⠙⢿⣿⣿⣿⣿⣿⡿⠟⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠰⣮⠻⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⡿⠟⠁⠄⠄⠙⢿⣷⣄⠄⠄⠄⠄⠄⠄⠈⠙⠛⠋⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠻⣿⣿⣿⣿⣿⡿⠿⠛⠄⠄⢀⠜⣵⡦⠄⠹⣿⣿⣦⣄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠄⠄⠄⠄⢀⣠⣤⣶⣷⡄⢀⣴⣶⣤⡀⠄⠉⠉⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄


⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣽⡿⣯⣾⣿⢗⣬⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣵⣿⣿⣿⣿⣿⣿⣵⣿⣿⣿⣆⠘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠄⠄⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠄⠄⠄⣿⠄⠄⠄⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣟⣯⣿⢿⣿⡌⣷⣿⡎⢺⣾⣝⢿⣿⣿⣿⣿⡎⠉⠛⠻⠿⠿⣿⠿⢿⠿⠿⠿⠿⠿⠃⠄⠄⡨⠄⠄⠄⠄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡿⣳⣿⣿⣿⣿⡆⣿⡇⢸⣿⡇⢨⣿⣿⢈⣿⣿⣿⣿⣷⡄⣀⡀⣴⣶⡄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸⡇⠄⠄⠄⠄⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡿⣿⣿⠋⠄⠄⣿⠁⣨⡗⢸⣿⠃⠸⣿⠟⠘⠿⠿⠿⠋⠄⠄⣻⢿⣻⠛⠁⢠⣤⠒⠄⠄⠄⠄⠄⠄⠘⠄⠄⠄⠄⠄⠄⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡀⠄⠄⠛⠄⣿⠄⣾⠏⠄⣼⠏⢀⣤⠄⠄⠄⠄⠄⠄⣻⣦⣿⣽⡿⠾⠃⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣳⣿⣿⣿⣷⣄⠄⠄⠄⠄⠄⠉⠄⠄⠄⠄⢛⠏⠄⠄⠄⠄⠄⠄⢿⣷⣬⡁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠄⠄⠄⠄⠄⠄⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣷⣠⠄⠄⠄⠄⠄⠄⠄⠄⣰⣿⣿⣿⣿⣿⣿⣏⣟⠻⠻⠛⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣠⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠈⠄⢀⣀⣀⣀⣀⣤⣾⣿⣿⣿⣿⠿⢋⣵⣿⣿⣿⣷⣦⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣽⣟⣿⠿⠿⣿⠫⠄⠄⣸⣿⣿⣿⣟⣯⣿⣿⣯⣽⠃⢠⣾⣿⣿⣿⢻⣿⣿⣗⡕⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠉⠛⠻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠁⠄⠈⠄⠄⠄⠄⣿⣿⣯⣿⣿⣿⣿⣿⣿⠏⢀⣿⣽⣿⣿⡿⡸⠟⣫⣿⣫⣶⣾⣿⡿⠁⠄⠄⢀⣾⣿⣿⣿⣿⣿⣿⣷⣶⣤⣀⠄⠄⠄⠉⠻⣿⣿⣿⣿
⣿⠃⠄⠄⠄⠄⠄⠄⢀⣛⣱⣿⢿⣿⣿⣿⣿⡟⠄⣸⣿⣿⣿⣿⠗⣼⣿⣿⣿⣯⣿⣶⠗⠄⠄⠄⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡄⠄⠄⠘⣿⣿⣿
⣅⠄⠠⠄⠄⠄⠄⠄⢸⣿⣿⣿⣿⣾⢿⢟⠵⠄⡠⣿⣿⣿⡿⠝⣨⣿⣿⣿⣿⣿⣿⠫⠄⠄⠄⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠄⠄⠸⣿⣿
⣿⣿⣿⣛⠂⠄⠄⠄⣾⣿⣿⣿⣿⣿⣻⣷⠃⠄⣴⣿⣿⡿⣫⣾⣿⣿⣿⣿⣿⡿⠛⢌⠢⡀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠄⡀⠈⠛
⣿⣿⣫⠇⠄⠄⠄⢰⣿⣿⣿⣿⡿⢳⣿⡇⠄⢸⣿⣿⡿⢱⣿⣿⣿⣿⣿⣿⡿⠃⠄⠄⣩⣵⣿⣿⣿⠋⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣦⠄
⣿⣟⡟⠄⠄⠄⠄⢸⣿⣿⡿⠋⠄⢸⣿⢀⡀⢻⣿⡿⠅⢸⣿⣿⣿⣿⣿⡏⣁⣀⠄⣰⣿⣿⣿⣿⡇⠄⠄⠄⠄⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷
⣿⣾⣧⠄⠄⠄⠄⠈⠁⠄⠄⠄⠄⠸⣿⡺⡄⡿⠿⣀⠄⠘⠿⢿⣿⣿⠿⢩⣾⡋⣠⣿⣿⣿⣿⠟⠁⠄⠄⠄⠄⠄⠄⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣤⣴⣶⣾⣶⠈⠄⠄⠄⠄⠄⠟⠇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠶⠁⢰⣿⢿⡛⠛⠁⠄⠄⠄⡀⠄⠄⠄⠄⠄⠄⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⠟⠛⠁⠄⠄⠄⠄⠄⠄⠄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠟⠃⠁⠄⠄⠄⠄⠄⠄⠄⣠⣄⠄⠄⠄⠄⠄⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣛⣿⣽⣇⣚⣀⠄⠄⠄⢀⣀⣀⣤⣴⣾⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⡄⠄⢠⣤⠄⣴⡟⠄⣴⣿⣿⣷⣄⠄⠄⠄⠄⠄⢹⣻⢿⣿⣿⡿⣿⣯⣿⣿             Vyacheslav
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⡿⠠⠾⠟⣕⣉⡤⢀⣀⣿⣿⣿⣿⣿⣷⠄⠄⠄⢀⣿⣿⣿⣽⣾⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢰⣾⣟⣵⣿⡟⣫⣾⢏⣼⣿⣿⣿⣿⡿⠁⠄⠄⢠⣿⣿⢯⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠸⣟⣼⣿⣯⣾⣿⣿⣿⣿⣿⣿⡿⡏⠄⠄⠄⣰⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⠟⠉⠄⠄⢀⣾⣿⣿⣟⣾⣿⣿⣿⣿⣿⣿⣿⡿⠃
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣿⣿⠟⠛⣻⣽⣿⣿⣿⡆⠄⠄⠄⣾⣿⣿⣟⣾⣿⣿⣿⣿⣿⣿⡻⠋⠁⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠻⠏⢀⣾⣿⣿⣿⣿⣿⡇⠄⠄⣸⣿⡿⣻⣿⣿⣿⣿⣿⡿⠟⠄⠄⠄⠄⣠
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣾⣿⠿⣿⣿⣿⣿⡇⠄⠄⢻⣟⣿⣿⣿⣿⣿⣿⡿⠉⠄⢀⣠⣴⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠉⠉⠉⠁⢠⣾⣿⣿⣿⣿⣿⣿⣿⡟⢁⣤⣶⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⠏⢀⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣿⣿⠋⣽⣿⣿⡿⠉⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣾⣿⠏⠘⠛⠻⠏⠄⠄⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⠁⠄⠄⠄⠄⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡗⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
*/

export function defineControlBlocks() {
  Blockly.Blocks['control_wait'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('SECS').setCheck('Number')
        .appendField('ждать').appendField(new Blockly.FieldNumber(1), '_').appendField('сек')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_repeat'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COUNT').setCheck('Number')
        .appendField('повторить').appendField(new Blockly.FieldNumber(10), '_').appendField('раз')
      this.appendStatementInput('BODY')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_repeat_until'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COND')
        .appendField('повторять пока не')
      this.appendStatementInput('BODY')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_forever'] = {
    init(this: Blockly.Block) {
      this.appendStatementInput('BODY').appendField('навсегда')
      this.setPreviousStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_if'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COND').appendField('если')
      this.appendStatementInput('BODY').appendField('то')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_if_else'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COND').appendField('если')
      this.appendStatementInput('BODY').appendField('то')
      this.appendStatementInput('ELSE').appendField('иначе')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_stop'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('остановить')
        .appendField(new Blockly.FieldDropdown([
          ['все', 'all'],
          ['этот скрипт', 'this']
        ]), 'TARGET')
      this.setPreviousStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_wait_until'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COND')
        .appendField('ждать пока')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }

  Blockly.Blocks['control_for_each'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('FROM').setCheck('Number')
        .appendField('для').appendField(new Blockly.FieldTextInput('i'), 'VAR')
        .appendField('от')
      this.appendValueInput('TO').setCheck('Number').appendField('до')
      this.appendStatementInput('BODY')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(CONTROL_COLOR)
    }
  }
}
