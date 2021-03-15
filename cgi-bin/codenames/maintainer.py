import os
import time

# not used right now

# this could be used to clear the temp dir from unused files,
# sadly I can't start a cronjob or anything like that bc I don't know how you guys will start it


def clear_temp_dir():
    current_time = time.time()
    for file in os.listdir('../../temp'):
        file = "../../temp/" + file
        last_time_accessed = os.path.getatime(file)  # timestamp last accessed
        print((current_time - last_time_accessed) / (24 * 60 * 60))
        if (current_time - last_time_accessed) / (24 * 60 * 60) > 2:  # more then two days
            os.unlink(file)


